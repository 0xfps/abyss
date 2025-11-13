import commaNumber from "comma-number"
import { toFourDecimals } from "./to-four-decimals"

export function formatNumber(num: number): string {
    if (isNaN(num)) return "0"
    return commaNumber(toFourDecimals(num))
}