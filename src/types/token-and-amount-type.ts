import { Token } from "@fifteenfigures/attp-config"
import { Dispatch, SetStateAction } from "react"

type Decimals = {
    decimals: number
}

export type TokenAndDecimal = Token & Decimals

export type TokenAndAmountType = {
    tokenToSend: TokenAndDecimal,
    setTokenToSend: Dispatch<SetStateAction<TokenAndDecimal>>
    amountToSend: number,
    setAmountToSend: Dispatch<SetStateAction<number>>

    tokenToReceive: TokenAndDecimal,
    setTokenToReceive: Dispatch<SetStateAction<TokenAndDecimal>>
    amountToReceive: number,
    setAmountToReceive: Dispatch<SetStateAction<number>>
}