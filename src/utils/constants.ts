import abyssConfig, { Token } from "@fifteenfigures/abyss-config"
import { arbitrumSepolia, avalancheFuji } from "viem/chains"
import abyssPng from "../../public/assets/abyss.png"

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

export const DEFAULT_TOKEN = {
    ...abyssConfig.testnetConfig.chainsConfig[DEFAULT_CHAIN_ID].tokens[0]
}
export const DEFAULT_NETWORK_FEE = 2.30
export const V_IMG = abyssPng
export const V_TOKEN: Omit<Token, "address" | "chainId"> = {
    image: abyssPng.src,
    name: "V",
    symbol: "V"
}
export const DECIMALS = 6
export const SWAP_GAS = 300_000
export const DEPOSIT_GAS = 800_000
export const WITHDRAW_GAS = 400_000