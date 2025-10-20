import { useEffect, useState } from "react"
import { TbFidgetSpinner } from "react-icons/tb";
import { PiCloudCheckFill } from "react-icons/pi";
import { useFetchLeafCount } from "@/hooks/use-fetch-leaf-count";
import { useAccount, useConfig } from "wagmi";
import commaNumber from "comma-number";
import { chainIsSupported } from "@/utils/chain-is-supported";
import { getChainFromId } from "@/utils/get-chain-from-id";
import attpConfig from "@fifteenfigures/attp-config";
import { ethers, EventLog, Log } from "ethers"
import { useLeavesStore } from "@/hooks/use-leaves-store";

export function Fetcher() {
    const config = useConfig()
    const { chainId } = useAccount()
    const leafCount = useFetchLeafCount()
    const [width, setWidth] = useState<number>(0)
    const { leaves, setLeaves, pushLeaves } = useLeavesStore()
    const [numberFetched, setNumberFetched] = useState<number>(0)

    useEffect(function () {
        setLeaves([])
        setNumberFetched(0)
        
        if (!chainId || !chainIsSupported(chainId, config)) {
            return
        }

        getLeaves()
    }, [chainId])

    async function getLeaves() {
        const event = "DepositAdded(bytes32)"
        const chain = getChainFromId(chainId!, config)
        const rpc = chain.rpcUrls.default.http[0]
        const provider = new ethers.JsonRpcProvider(rpc);
        const address = attpConfig.testnetConfig.chainsConfig[chainId!].attpAddress as string
        const abi = attpConfig.attpAbi
        const contract = new ethers.Contract(address, abi as any, provider)
        const blockNumber = await provider.getBlockNumber()
        let startBlockNumber = Number(attpConfig.testnetConfig.chainsConfig[chainId!].blockNumber)
        const skip = 900

        while (Number(startBlockNumber) < blockNumber) {
            const filters = await contract.queryFilter(
                event, startBlockNumber, startBlockNumber + skip
            )

            if (filters.length > 0) {
                const leaves: string[] = []

                filters.forEach(function (filter: Log | EventLog) {
                    leaves.push(filter.topics[1])
                })

                pushLeaves(leaves)
                setNumberFetched(prev => prev + leaves.length)
            }

            startBlockNumber += skip + 1
        }
    }

    useEffect(function () {
        calculateAndSetWidth()
    }, [numberFetched])

    function calculateAndSetWidth() {
        if (numberFetched == 0) setWidth(0)
        else if (leafCount == 0) setWidth(0)
        else setWidth(Math.floor((numberFetched * 100) / leafCount))
    }

    return <div className="py-2 md:p-2 col-span-4 md:col-span-1">
        <div className="flex justify-start items-center">
            <span className="text-xl text-btn-success">
                {leafCount == 0 && <PiCloudCheckFill />} 
                {leafCount != 0 ? width < 100 ? <TbFidgetSpinner className="spinner" /> : <PiCloudCheckFill /> : ""}
            </span>
            <span className="ml-2 text-sm md:text-base">
                { leafCount == 0 && "No leaves on this chain."}
                {(leafCount != 0 && width < 100) && `Fetching leaves... (${commaNumber(numberFetched)}/${commaNumber(leafCount)})`}
                {(leafCount != 0 && width >= 100) && `Fetched leaves. (${commaNumber(numberFetched)}/${commaNumber(leafCount)})`}
                ({width}%)
            </span>
        </div>
        <div className="border border-btn-success p-1 mt-1">
            <div className="bg-btn-success p-2" style={{ width: `${width}%` }}></div>
        </div>
    </div>
}