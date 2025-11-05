import { ChildType } from "@/types/child-type";
import { TokenAndAmountType, TokenAndDecimal } from "@/types/token-and-amount-type";
import { DEFAULT_TOKEN } from "@/utils/constants";
import { createContext, useState } from "react";

export const TokenAndAmountContext = createContext<TokenAndAmountType>({
    tokenToSend: DEFAULT_TOKEN,
    amountToSend: 0,
    setTokenToSend: () => { },
    setAmountToSend: () => { },
    tokenToReceive: DEFAULT_TOKEN,
    amountToReceive: 0,
    setTokenToReceive: () => { },
    setAmountToReceive: () => { }
})

export function TokenAndAmountProvider({ children }: ChildType) {
    const [tokenToSend, setTokenToSend] = useState<TokenAndDecimal>(DEFAULT_TOKEN)
    const [amountToSend, setAmountToSend] = useState<number>(0)

    const [tokenToReceive, setTokenToReceive] = useState<TokenAndDecimal>(DEFAULT_TOKEN)
    const [amountToReceive, setAmountToReceive] = useState<number>(0)

    const values = {
        tokenToSend,
        amountToSend,
        setTokenToSend,
        setAmountToSend,
        tokenToReceive,
        amountToReceive,
        setTokenToReceive,
        setAmountToReceive
    }

    return <TokenAndAmountContext.Provider value={values}>
        {children}
    </TokenAndAmountContext.Provider>
}