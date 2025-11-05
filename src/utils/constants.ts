import attpConfig from "@fifteenfigures/attp-config"
import { arbitrumSepolia } from "viem/chains"

export const LEGAL_TOS = "legal-tos"
export const HOW_TO_USE = "how-to-use"
export const LATEST_ANNOUNCEMENT = "announcement-afe453ef"
export const DEPOSIT_EVENT = "DepositAdded(bytes32)"
export const BLOCK_CRAWL_INTERVAL = 900
export const SVG_IMG_PREPEND = "data:image/svg+xml;utf8,"
export const DEFAULT_CHAIN_ID=arbitrumSepolia.id
export const DEFAULT_TOKEN = {
    ...attpConfig.testnetConfig.chainsConfig[DEFAULT_CHAIN_ID].tokens[0],
    decimals: 6
}
export const DEFAULT_NETWORK_FEE = 2.30