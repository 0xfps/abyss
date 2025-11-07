"use client"

import { chainIsSupported } from "@/utils/chain-is-supported";
import { useContext, useEffect, useState } from "react";
import { useConfig } from "wagmi";
import attpConfig from "@fifteenfigures/attp-config"
import { readContract } from "@wagmi/core"
import { PollChainIdContext } from "@/providers/poll-chain-id-provider";
import { DepositWithdrawContext } from "@/providers/deposit-withdrawal-provider";
import { ChainIdContext } from "@/providers/chain-id-provider";

export function useFetchLeafCount(): number {
    const config = useConfig()
    const { pollChainId } = useContext(PollChainIdContext)
    const [leafCount, setLeafCount] = useState<number>(0)
    const { chainId } = useContext(ChainIdContext)
    const { trigger } = useContext(DepositWithdrawContext)

    const abi = attpConfig.attpAbi
    useEffect(function () {
        if (!pollChainId || !chainIsSupported(pollChainId, config)) {
            setLeafCount(0)
            return
        }

        getLeafCount()
    }, [pollChainId])

    // Trigger a refetch if the chain deposited on is the same chain being polled.
    // A remove of the poll chain and reset of the poll chain to the same 
    // chain doesn't work.
    useEffect(function () {
        if (trigger && chainId == pollChainId) {
            if (!pollChainId || !chainIsSupported(pollChainId, config)) {
                return
            }

            getLeafCount()
        }

    }, [trigger])

    async function getLeafCount() {
        const mainAddress = attpConfig.testnetConfig.chainsConfig[pollChainId!].attpAddress
        const leafCount = await readContract(config, {
            address: mainAddress as `0x${string}`,
            abi,
            functionName: "length",
            chainId: pollChainId
        })

        setLeafCount(leafCount as number)
    }

    return leafCount
}