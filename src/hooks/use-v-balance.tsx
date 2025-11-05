import attpConfig from "@fifteenfigures/attp-config";
import { useContext, useEffect, useState } from "react";
import { useAccount, useConfig } from "wagmi";
import { readContract } from "@wagmi/core"
import { erc20Abi } from "viem";
import { ChainIdContext } from "@/providers/chain-id-provider";

export function useVBalance(): number | null {
    const config = useConfig()
    const { chainId } = useContext(ChainIdContext)
    const { address: userAddress } = useAccount()
    const [tokenBalance, setTokenBalance] = useState<number | null>(null)

    useEffect(function () {
        setTokenBalance(null)

        if (userAddress) getTokenBalance()
        else setTokenBalance(0)
    }, [chainId, userAddress])

    async function getTokenBalance() {
        const decimal = await getDecimal()
        const address = attpConfig.testnetConfig.chainsConfig[chainId].swapperAddress

        const balanceOfUser = await readContract(config, {
            address: address as `0x${string}`,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [userAddress as `0x${string}`],
            chainId
        })

        const balanceBase = Number(balanceOfUser)
        const balance = parseFloat((balanceBase / (10 ** decimal)).toFixed(2))
        setTokenBalance(balance)
    }

    async function getDecimal(): Promise<number> {
        const address = attpConfig.testnetConfig.chainsConfig[chainId].swapperAddress

        const decimals = await readContract(config, {
            address: address as `0x${string}`,
            abi: erc20Abi,
            functionName: "decimals",
            chainId
        })

        return Number(decimals)
    }

    return tokenBalance
}