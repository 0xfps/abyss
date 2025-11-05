import { Token } from "@fifteenfigures/attp-config";
import { useEffect, useState } from "react";
import { useAccount, useConfig } from "wagmi";
import { getBalance, readContract } from "@wagmi/core"
import { erc20Abi } from "viem";
import { ZeroAddress } from "ethers";

export function useTokenBalance(token: Token): number | null {
    const config = useConfig()
    const { address: userAddress } = useAccount()
    const [tokenBalance, setTokenBalance] = useState<number | null>(null)

    useEffect(function () {
        setTokenBalance(null)

        if (userAddress) getTokenBalance()
        else setTokenBalance(0)
    }, [token, userAddress])

    async function getTokenBalance() {
        const decimal = await getDecimal()
        const { address, chainId } = token

        let balanceOfUser: bigint

        if (address == ZeroAddress)
            balanceOfUser = (await getBalance(config, {
                address: userAddress as `0x${string}`,
                chainId
            })).value
        else balanceOfUser = await readContract(config, {
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
        const { address, chainId } = token

        if (address == ZeroAddress) return 18

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