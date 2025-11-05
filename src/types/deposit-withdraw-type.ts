import { Dispatch, SetStateAction } from "react"

export type DepositWithdrawType = {
    includeLeaf: boolean
    secretKey: string
    withdrawalKey: string,
    setSecretKey: Dispatch<SetStateAction<string>>
    setWithdrawalKey: Dispatch<SetStateAction<string>>
    setIncludeLeaf: Dispatch<SetStateAction<boolean>>
    autogenerateKey: () => void
}