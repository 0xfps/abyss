export function toTwoDecimals(num: number): number {
    return parseFloat(num.toFixed(2))
}

export function formatToTwoDecimals(num: number): string {
    if (isNaN(num)) return "0"
    return new Intl.NumberFormat().format(num)
}