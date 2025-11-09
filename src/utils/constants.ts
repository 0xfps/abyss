import attpConfig, { Token } from "@fifteenfigures/attp-config"
import { arbitrumSepolia, avalancheFuji } from "viem/chains"
import v from "../../public/assets/bitcoin.svg"

export const LEGAL_TOS = "legal-tos"
export const HOW_TO_USE = "how-to-use"
export const LATEST_ANNOUNCEMENT = "announcement-afe453ef"
export const DEPOSIT_EVENT = "DepositAdded(bytes32)"
export const DEPOSIT_EVENT_NAME = "DepositAdded"
export const DEFAULT_BLOCK_CRAWL_INTERVAL = 9_900
export const BLOCK_CRAWL_INTERVAL: Record<number, number> = {
    [avalancheFuji.id]: 2_000
}
export const SVG_IMG_PREPEND = "data:image/svg+xml;utf8,"
export const DEFAULT_CHAIN_ID = arbitrumSepolia.id

const firstToken = Object.keys(attpConfig.testnetConfig.chainsConfig[DEFAULT_CHAIN_ID].tokens)[0]
export const DEFAULT_TOKEN = {
    ...attpConfig.testnetConfig.chainsConfig[DEFAULT_CHAIN_ID].tokens[firstToken]
}
export const DEFAULT_NETWORK_FEE = 2.30
export const V_IMG = v
export const V_TOKEN: Omit<Token, "address" | "chainId"> = {
    image: v.src,
    name: "V",
    symbol: "V"
}
export const DECIMALS = 6