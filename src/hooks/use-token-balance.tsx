import { Token } from "@fifteenfigures/abyss-config";
import { useContext, useEffect, useState } from "react";
import { useAccount, useConfig } from "wagmi";
import { DepositWithdrawContext } from "@/providers/deposit-withdrawal-provider";
import { getTokenBalanceFor } from "@/utils/get-token-balance-for";

export function useTokenBalance(token: Token): number | null {
    const config = useConfig()
    const { address: userAddress } = useAccount()
    const [tokenBalance, setTokenBalance] = useState<number | null>(null)
    const { trigger } = useContext(DepositWithdrawContext)

    useEffect(function () {
        setTokenBalance(null)

        if (userAddress) getTokenBalance()
        else setTokenBalance(0)
    }, [token, userAddress, trigger])

    async function getTokenBalance() {
        const balance = await getTokenBalanceFor(userAddress!, config, token)
        setTokenBalance(balance)
    }

    return tokenBalance
}