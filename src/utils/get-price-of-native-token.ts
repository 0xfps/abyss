import abyssConfig from "@fifteenfigures/abyss-config"
import { hexify } from "@fifteenfigures/tiny-merkle-tree"
import { HermesClient } from "@pythnetwork/hermes-client"
import { readContract } from "@wagmi/core"
import { ZeroAddress } from "ethers"
import { Config } from "wagmi"

export async function getPriceOfNativeToken(config: Config, chainId: number): Promise<{ price: number, updateData: string[] }> {
    const hermesConnection = new HermesClient("https://hermes.pyth.network", {})

    const oracleRegistry = abyssConfig.testnetConfig.chainsConfig[chainId].oracleRegistryAddress
    const { oracleRegistryAbi } = abyssConfig
    const address = ZeroAddress

    const priceFeedId = await readContract(config, {
        address: oracleRegistry as `0x${string}`,
        abi: oracleRegistryAbi,
        functionName: "getPriceFeed",
        args: [address],
        chainId
    })

    const updates = await hermesConnection.getLatestPriceUpdates([priceFeedId as string])
    const updateData = updates.binary.data.map(function (data) {
        return hexify(data)
    })

    if (updates.parsed) {
        const parsedPrice = BigInt(updates.parsed[0].price.price)
        const expo = BigInt(10 ** (-1 * updates.parsed[0].price.expo))
        const price = parseFloat((Number(parsedPrice) / Number(expo)).toFixed(2))
        return { price, updateData }
    } else {
        return { price: 0, updateData }
    }
}