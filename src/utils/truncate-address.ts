export function truncateAddress(address: string, size: number = 6) {
    if ((size * 2) + 2 >= address.length) return address
    return `${address.slice(0, size + 2)}...${address.slice(-1 * size)}`
}