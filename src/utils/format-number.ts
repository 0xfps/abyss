export function formatNumber(num: number): string {
    if (isNaN(num)) return "0"
    return new Intl.NumberFormat().format(num)
}