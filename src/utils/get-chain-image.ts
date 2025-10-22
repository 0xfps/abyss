import attpConfig from "@fifteenfigures/attp-config";

export function getChainImage(id: number): string {
    return attpConfig.testnetConfig.chainsConfig[id].image
}