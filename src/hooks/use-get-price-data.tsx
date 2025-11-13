import { PriceDataType } from "@/types/price-data";
import abyssConfig, { Token } from "@fifteenfigures/abyss-config";
import { useEffect, useState } from "react";
import { HermesClient } from "@pythnetwork/hermes-client"
import { readContract } from "@wagmi/core"
import { useConfig } from "wagmi";
import { hexify } from "@fifteenfigures/tiny-merkle-tree";
import { ZeroAddress } from "ethers";
import { getPriceOfNativeToken } from "@/utils/get-price-of-native-token";

export function useGetPriceData(token: Token): PriceDataType {
    const config = useConfig()
    const [price, setPrice] = useState<number | null>(null)
    const [updateFeeData, setUpdateFeeData] = useState<string[]>([])
    const { oracleRegistryAbi } = abyssConfig

    useEffect(function () {
        getPriceData()
    }, [token])

    function getOracleRegistryOnTokenChain(): string {
        return abyssConfig.testnetConfig.chainsConfig[token.chainId].oracleRegistryAddress
    }

    async function getPriceFeedFromContract(): Promise<string> {
        const oracleRegistry = getOracleRegistryOnTokenChain()

        const { address, chainId } = token

        const priceFeedId = await readContract(config, {
            address: oracleRegistry as `0x${string}`,
            abi: oracleRegistryAbi,
            functionName: "getPriceFeed",
            args: [address],
            chainId
        })

        return priceFeedId as string
    }

    async function getPriceData() {
        if (token.address == ZeroAddress) {
            const { price, updateData } = await getPriceOfNativeToken(config, token.chainId)
            setPrice(price)
            setUpdateFeeData(updateData)
        } else return await getPriceOfERC20Token()
    }

    async function getPriceOfERC20Token() {
        const hermesConnection = new HermesClient("https://hermes.pyth.network", {})

        const priceFeedId = await getPriceFeedFromContract()
        const updates = await hermesConnection.getLatestPriceUpdates([priceFeedId])
        const hexifiedData = updates.binary.data.map(function (data) {
            return hexify(data)
        })

        setUpdateFeeData(hexifiedData)

        if (updates.parsed) {
            const parsedPrice = BigInt(updates.parsed[0].price.price)
            const expo = BigInt(10 ** (-1 * updates.parsed[0].price.expo))
            const price = parseFloat((Number(parsedPrice) / Number(expo)).toFixed(2))
            setPrice(price)
        } else {
            setPrice(0)
        }
    }

    return { updateFeeData, price }
}