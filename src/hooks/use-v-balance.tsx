import abyssConfig from "@fifteenfigures/abyss-config";
import { useContext, useEffect, useState } from "react";
import { useAccount, useConfig } from "wagmi";
import { readContract } from "@wagmi/core"
import { erc20Abi } from "viem";
import { ChainIdContext } from "@/providers/chain-id-provider";
import { DECIMALS } from "@/utils/constants";
import { DepositWithdrawContext } from "@/providers/deposit-withdrawal-provider";

export function useVBalance(): number | null {
    const config = useConfig()
    const { chainId } = useContext(ChainIdContext)
    const { address: userAddress } = useAccount()
    const [tokenBalance, setTokenBalance] = useState<number | null>(null)
    const { trigger } = useContext(DepositWithdrawContext)

    useEffect(function () {
        setTokenBalance(null)

        if (userAddress) getTokenBalance()
        else setTokenBalance(0)
    }, [chainId, userAddress, trigger])

    async function getTokenBalance() {
        const address = abyssConfig.testnetConfig.chainsConfig[chainId].swapperAddress

        const balanceOfUser = await readContract(config, {
            address: address as `0x${string}`,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [userAddress as `0x${string}`],
            chainId
        })

        const balanceBase = Number(balanceOfUser)
        const balance = parseFloat((balanceBase / (10 ** DECIMALS)).toFixed(5))
        setTokenBalance(balance)
    }

    return tokenBalance
}