import { Token } from "@fifteenfigures/attp-config";
import { ZeroAddress } from "ethers";

export function isETH(token: Token): boolean {
    return token.address == ZeroAddress
}