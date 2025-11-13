import commaNumber from "comma-number"

export function toFourDecimals(num: number): number {
    return parseFloat(num.toFixed(4))
}

export function formatToFourDecimals(num: number): string {
    if (isNaN(num)) return "0"
    return commaNumber(toFourDecimals(num))
}