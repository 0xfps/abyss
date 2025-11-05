import { Token } from "@fifteenfigures/attp-config"
import { Dispatch, SetStateAction } from "react"

type Decimals = {
    decimals: number
}

export type TokenAndDecimal = Token & Decimals

export type TokenAndAmountType = {
    tokenToSend: Token,
    setTokenToSend: Dispatch<SetStateAction<Token>>
    amountToSend: string,
    setAmountToSend: Dispatch<SetStateAction<string>>

    tokenToReceive: Token,
    setTokenToReceive: Dispatch<SetStateAction<Token>>
    amountToReceive: number,
    setAmountToReceive: Dispatch<SetStateAction<number>>
}