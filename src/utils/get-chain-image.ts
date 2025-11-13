import abyssConfig from "@fifteenfigures/abyss-config";

export function getChainImage(id: number): string {
    return abyssConfig.testnetConfig.chainsConfig[id].image
}