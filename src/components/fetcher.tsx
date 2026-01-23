import { useContext, useEffect, useState } from "react"
import { TbFidgetSpinner } from "react-icons/tb";
import { PiCloudCheckFill } from "react-icons/pi";
import { useFetchLeafCount } from "@/hooks/use-fetch-leaf-count";
import { useConfig } from "wagmi";
import commaNumber from "comma-number";
import { chainIsSupported } from "@/utils/chain-is-supported";
import { getChainFromId } from "@/utils/get-chain-from-id";
import abyssConfig from "@fifteenfigures/abyss-config";
import { ethers, EventLog, InterfaceAbi, JsonRpcProvider, Log } from "ethers"
import { BLOCK_CRAWL_INTERVAL, DEFAULT_BLOCK_CRAWL_INTERVAL, DEPOSIT_EVENT } from "@/utils/constants";
import { PollChainIdContext } from "@/providers/poll-chain-id-provider";
import { getChainName } from "@/utils/get-chain-name";
import { useModalStore } from "@/store/modal-store";
import { LeavesContext } from "@/providers/leaves-provider";
import { DepositWithdrawContext } from "@/providers/deposit-withdrawal-provider";
import { ChainIdContext } from "@/providers/chain-id-provider";
import { gql, request } from "graphql-request"

interface GraphLeaves {
    leaf: string
}

export function Fetcher() {
    const config = useConfig()
    const { pollChainId } = useContext(PollChainIdContext)
    const { setModal, setPrevModal } = useModalStore()
    const leafCount = useFetchLeafCount()
    const [width, setWidth] = useState<number>(0)
    const { setLeaves, pushLeaves } = useContext(LeavesContext)
    const [numberFetched, setNumberFetched] = useState<number>(0)
    const { chainId } = useContext(ChainIdContext)
    const { trigger } = useContext(DepositWithdrawContext)
    const [t, setT] = useState<NodeJS.Timeout | null>(null)

    useEffect(function () {
        setLeaves([])
        setNumberFetched(0)

        if (!pollChainId || !chainIsSupported(pollChainId, config)) {
            return
        }

        pollLeaves()
    }, [pollChainId])

    // Trigger a refetch if the chain deposited on is the same chain being polled.
    // A remove of the poll chain and reset of the poll chain to the same
    // chain doesn't work.
    useEffect(function () {
        if (trigger && chainId == pollChainId) {
            setLeaves([])
            setNumberFetched(0)

            if (!pollChainId || !chainIsSupported(pollChainId, config)) {
                return
            }

            pollLeaves()
        }

    }, [trigger])

    async function pollLeaves() {
        const t = setTimeout(async function () {
            getLeaves()
        }, 2_000)

        setT(t)
    }

    useEffect(function () {
        return function () {
            if (t) clearTimeout(t)
        }
    }, [])

    async function getLeaves() {
        const indexerURL = abyssConfig.testnetConfig.chainsConfig[pollChainId].indexerURL

        if (!indexerURL) return

        const query = gql`{
            depositAddeds (
                orderBy: blockNumber,
                orderDirection: asc
            ) {
                leaf
            }
        }`

        const headers = { Authorization: `Bearer ${process.env.GRAPH_API_KEY}` }
        const data = await request(indexerURL, query, {}, headers)

        if (data && data.depositAddeds) {
            extractLeaves(data.depositAddeds)
        }
    }

    function extractLeaves(fetchedLeaves: GraphLeaves[]) {
        const leaves: string[] = []

        for (const { leaf } of fetchedLeaves) {
            setNumberFetched(prev => prev + 1)
            leaves.push(leaf)
        }

        pushLeaves(leaves)
    }

    useEffect(function () {
        calculateAndSetWidth()
    }, [numberFetched])

    function calculateAndSetWidth() {
        if (numberFetched == 0) setWidth(0)
        else if (leafCount == 0) setWidth(0)
        else setWidth(Math.floor((numberFetched * 100) / leafCount))
    }

    return <div className="py-2 lg:p-2 col-span-6 lg:col-span-2">
        <div className="flex justify-between items-center">
            <span className="flex justify-start items-center">
                <span className="text-xl text-btn-success">
                    {leafCount == 0 && <PiCloudCheckFill />}
                    {leafCount != 0 ? width < 100 ? <TbFidgetSpinner className="spinner" /> : <PiCloudCheckFill /> : ""}
                </span>
                <span className="ml-2 text-sm md:text-base">
                    {pollChainId == 0 && "No chain selected."}
                    {(pollChainId != 0 && leafCount == 0) && "No leaves on this chain."}
                    {(leafCount != 0 && width < 100) && `Fetching leaves... (${commaNumber(numberFetched)}/${commaNumber(leafCount)})`}
                    {(leafCount != 0 && width >= 100) && `Fetched leaves. (${commaNumber(numberFetched)}/${commaNumber(leafCount)})`}
                    ({width}%)
                </span>
            </span>

            <span className="flex flex-col justify-end">
                <span className="cursor-pointer hover:opacity-80 text-sm" onClick={() => {
                    setPrevModal("")
                    setModal("SWITCH-CHAIN")
                }}>[Switch]</span>
            </span>
        </div>
        <div className="border border-btn-success p-1 mt-1 relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm w-full h-full flex justify-center items-center">
                {
                    chainIsSupported(pollChainId, config)
                        ? getChainName(getChainFromId(pollChainId, config))
                        : ""
                }
            </span>
            <div className="bg-btn-success p-2" style={{ width: `${width}%` }}></div>
        </div>
    </div>
}