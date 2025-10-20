"use client"

import { chainIsSupported } from "@/utils/chain-is-supported";
import { useEffect, useState } from "react";
import { useAccount, useConfig } from "wagmi";
import attpConfig from "@fifteenfigures/attp-config"
import { readContract } from "@wagmi/core"

export function useFetchLeafCount(): number {
    const config = useConfig()
    const { chainId } = useAccount()
    const [leafCount, setLeafCount] = useState<number>(0)

    const abi = attpConfig.attpAbi
    useEffect(function () {
        if (!chainId || !chainIsSupported(chainId, config)) {
            setLeafCount(0)
            return
        }

        getLeafCount()
    }, [chainId])

    async function getLeafCount() {
        const mainAddress = attpConfig.testnetConfig.chainsConfig[chainId!].attpAddress
        const leafCount = await readContract(config, {
            address: mainAddress as `0x${string}`,
            abi,
            functionName: "length",
            chainId
        })

        setLeafCount(leafCount as number)
    }

    return leafCount
}