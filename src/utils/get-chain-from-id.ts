import { Chain } from "viem";
import { Config } from "wagmi";

export function getChainFromId(chainId: number, config: Config): Chain {
    const chains = config.chains
    const chain = chains.find(function (_chain) {
        return _chain.id === chainId
    })
    
    return chain!
}