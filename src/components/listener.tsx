import { ChainIdContext } from "@/providers/chain-id-provider"
import { getChainFromId } from "@/utils/get-chain-from-id"
import { getChainName } from "@/utils/get-chain-name"
import { truncateAddress } from "@/utils/truncate-address"
import attpConfig from "@fifteenfigures/attp-config"
import { useContext, useEffect, useState } from "react"
import { LuSquareArrowOutUpRight } from "react-icons/lu"
import { useConfig } from "wagmi"
import { watchContractEvent } from '@wagmi/core'
import { DEPOSIT_EVENT_NAME } from "@/utils/constants"
import { parseExplorerLinkFromHash } from "@/utils/parse-explorer-link-from-hash"

interface LeafList {
    leaf: string,
    transactionHash: string | null
}

export function Listener() {
    const config = useConfig()
    const { chainId } = useContext(ChainIdContext)
    const [leaves, setLeaves] = useState<LeafList[]>([])
    const { attpAbi } = attpConfig
    const LENGTH = 8

    useEffect(function () {
        const { attpAddress } = attpConfig.testnetConfig.chainsConfig[chainId]
        const unwatch = watchContractEvent(config, {
            address: attpAddress as `0x${string}`,
            abi: attpAbi,
            eventName: DEPOSIT_EVENT_NAME,
            chainId,
            onLogs(logs) {
                const leavesAndTxs = logs.map(function ({ topics, transactionHash }) {
                    return { leaf: topics[1] as string, transactionHash }
                })

                if (leavesAndTxs) {
                    addLeaves(leavesAndTxs)
                }
            }
        })

        return function () {
            unwatch()
        }
    }, [chainId])

    function addLeaves(leavesAndTxs: LeafList[]) {
        leaves.unshift(...leavesAndTxs)
        const first10Leaves = leaves.slice(0, LENGTH)
        setLeaves(first10Leaves)
    }

    return <div className="lg:p-2 col-span-6 lg:col-span-2 hidden lg:block h-[600px]">
        <div className="p-2 bg-modal-bg h-full">
            <div className="flex justify-center items-center text-sm bg-body py-2 h-[10%]">
                New Deposits ({getChainName(getChainFromId(chainId, config))})
            </div>
            <div className="p-1 bg-transparent h-[1%]"></div>
            <div className=" h-[89%] grid grid-rows-8 gap-0.5">
                <div className="row-span-1 grid grid-cols-3 bg-body text-sm">
                    <div className="col-span-1 flex justify-center items-center">
                        User
                    </div>
                    <div className="col-span-1 flex justify-center items-center">
                        Deposit
                    </div>
                    <div className="col-span-1 flex justify-center items-center">
                        Leaf
                    </div>
                </div>
                {
                    leaves.length == 0 ?
                        <div className="row-span-1 mt-2 bg-body text-sm cursor-default flex justify-center items-center">
                            No new deposits
                        </div>
                        : leaves.map(function ({ leaf, transactionHash }: LeafList, i: number) {
                            return <div className="row-span-1 grid grid-cols-3 bg-body text-sm cursor-default" key={i}>
                                <div className="col-span-1 flex justify-center items-center">
                                    {i + 1}. Anon 🕵🏼‍♂️
                                </div>
                                <div className="col-span-1 flex justify-center items-center">
                                    $******
                                </div>
                                {
                                    transactionHash ?
                                        <a
                                            className="col-span-1 flex justify-center items-center cursor-pointer hover:underline"
                                            href={parseExplorerLinkFromHash(transactionHash, chainId, config)}
                                            target="_blank"
                                        >
                                            {truncateAddress(leaf, 4)} <span><LuSquareArrowOutUpRight className="ml-1" /></span>
                                        </a>
                                        :
                                        <div
                                            className="col-span-1 flex justify-center items-center cursor-pointer hover:underline"
                                        >
                                            {truncateAddress(leaf, 4)} <span><LuSquareArrowOutUpRight className="ml-1" /></span>
                                        </div>
                                }
                            </div>
                        })
                }
            </div>
        </div>
    </div>
}