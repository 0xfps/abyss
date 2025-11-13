import { Token } from "@fifteenfigures/abyss-config";
import { Config } from "wagmi";
import { getDecimals } from "./get-decimals";
import { getBalance, readContract } from "@wagmi/core";
import { erc20Abi } from "viem";
import { isETH } from "./is-eth";

export async function getTokenBalanceFor(address: string, config: Config, token: Token): Promise<number> {
    const decimal = await getDecimals(token, config)
    let balanceOf: bigint

    if (isETH(token))
        balanceOf = (await getBalance(config, {
            address: address as `0x${string}`,
            chainId: token.chainId
        })).value
    else balanceOf = await readContract(config, {
        address: token.address as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
        chainId: token.chainId
    })

    const balanceBase = Number(balanceOf)
    const balance = parseFloat((balanceBase / (10 ** decimal)).toFixed(5))
    return balance
}