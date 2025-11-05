import { PriceDataType } from "@/types/price-data";
import attpConfig, { Token } from "@fifteenfigures/attp-config";
import { useEffect, useState } from "react";
import { HermesClient } from "@pythnetwork/hermes-client"
import { readContract } from "@wagmi/core"
import { useConfig } from "wagmi";
import { hexify } from "@fifteenfigures/tiny-merkle-tree";

export function useGetPriceData(token: Token): PriceDataType {
    const config = useConfig()
    const [price, setPrice] = useState<number | null>(null)
    const [updateFeeData, setUpdateFeeData] = useState<string[]>([])
    const hermesConnection = new HermesClient("https://hermes.pyth.network", {})
    const { oracleRegistryAbi, swapperAbi } = attpConfig

    useEffect(function () {
        getPriceData()
    }, [token])

    function getOracleRegistryOnTokenChain(): string {
        return attpConfig.testnetConfig.chainsConfig[token.chainId].oracleRegistryAddress
    }

    function getSwapperRegistryOnTokenChain(): string {
        return attpConfig.testnetConfig.chainsConfig[token.chainId].swapperAddress
    }

    async function isStableCoin(): Promise<boolean> {
        const swapper = getSwapperRegistryOnTokenChain()
        const { address, chainId } = token
        const isStable = await readContract(config, {
            address: swapper as `0x${string}`,
            abi: swapperAbi,
            functionName: "chainStables",
            args: [address],
            chainId
        })

        return isStable as boolean
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
        const tokenIsStableCoin = await isStableCoin()

        if (tokenIsStableCoin) {
            setUpdateFeeData([])
            setPrice(1)
            return
        }

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