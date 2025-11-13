import { Token } from "@fifteenfigures/abyss-config";
import { ZeroAddress } from "ethers";

export function isETH(token: Token): boolean {
    return token.address == ZeroAddress
}