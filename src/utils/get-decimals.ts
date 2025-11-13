import { Token } from "@fifteenfigures/abyss-config"
import { readContract } from "@wagmi/core"
import { ZeroAddress } from "ethers"
import { erc20Abi } from "viem"
import { Config } from "wagmi"

export async function getDecimals(token: Token, config: Config): Promise<number> {
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