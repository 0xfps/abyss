import attpConfig, { Token } from "@fifteenfigures/attp-config"
import { readContract } from "@wagmi/core"
import { Config } from "wagmi"

function getSwapperRegistryOnTokenChain(id: number): string {
    return attpConfig.testnetConfig.chainsConfig[id].swapperAddress
}

export async function isStableCoin(tokenToSend: Token, config: Config): Promise<boolean> {
    const { swapperAbi } = attpConfig
    const { address, chainId } = tokenToSend
    const swapper = getSwapperRegistryOnTokenChain(chainId)

    const isStable = await readContract(config, {
        address: swapper as `0x${string}`,
        abi: swapperAbi,
        functionName: "chainStables",
        args: [address],
        chainId
    })

    return isStable as boolean
}