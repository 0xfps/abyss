import { Config } from "wagmi";
import { getChainFromId } from "./get-chain-from-id";

export function parseExplorerLinkFromHash(hash: string, chainId: number, config: Config): string {
    const chain = getChainFromId(chainId, config)
    if (!chain.blockExplorers) {
        return "#"
    }

    const explorerUrl = chain.blockExplorers.default.url
    const link = `${explorerUrl}/tx/${hash}`
    return link
}