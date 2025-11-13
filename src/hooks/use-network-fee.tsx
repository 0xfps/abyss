import { ChainIdContext } from "@/providers/chain-id-provider";
import { ActionTypes } from "@/types/action-type";
import { DEPOSIT_GAS, SWAP_GAS, WITHDRAW_GAS } from "@/utils/constants";
import { useContext, useEffect, useState } from "react";
import { getGasPrice } from '@wagmi/core'
import { useConfig } from "wagmi";
import { getPriceOfNativeToken } from "@/utils/get-price-of-native-token";

export function useNetworkFee(action: ActionTypes): number | null {
    const config = useConfig()
    const { chainId } = useContext(ChainIdContext)
    const [networkFee, setNetworkFee] = useState<number | null>(null)

    useEffect(function () {
        if (chainId) {
            loadNetworkFee()
        }
    }), [action, chainId]

    async function loadNetworkFee() {
        let gas = ["SWAP", "REDEEM"].includes(action)
            ? SWAP_GAS
            : action == "DEPOSIT"
                ? DEPOSIT_GAS
                : WITHDRAW_GAS

        const gasPrice = await getGasPrice(config, {
            chainId
        })

        const gasUnits = BigInt(gas) * gasPrice
        const baseFee = parseFloat((Number(gasUnits) / 1e18).toFixed(5))
        const {price} = await getPriceOfNativeToken(config, chainId)

        const networkFee = parseFloat((baseFee * price).toFixed(4)) + 0.157
        setNetworkFee(networkFee)
    }

    return networkFee
}