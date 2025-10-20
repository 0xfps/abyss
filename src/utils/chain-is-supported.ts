import { Chain } from "viem";
import { Config, useConfig } from "wagmi";

export function chainIsSupported(chainId: number, config: Config): boolean {
    const chains = config.chains

    const chain = chains.find(function (_chain: Chain) {
        return _chain.id === chainId
    })

    return chain != undefined
}