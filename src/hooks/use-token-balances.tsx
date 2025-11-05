import { TokenAndDecimal } from "@/types/token-and-amount-type";
import { useState } from "react";

export function useTokenBalances(token: TokenAndDecimal): number | null {
    token;
    const [tokenBalance, setTokenBalance] = useState(null)

    return tokenBalance
}