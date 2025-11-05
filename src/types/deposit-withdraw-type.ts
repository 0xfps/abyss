import { Dispatch, SetStateAction } from "react"

export type DepositWithdrawType = {
    includeLeaf: boolean
    secretKey: string
    withdrawalKey: string,
    hidden: boolean,
    setHidden: Dispatch<SetStateAction<boolean>>
    setSecretKey: Dispatch<SetStateAction<string>>
    setWithdrawalKey: Dispatch<SetStateAction<string>>
    setIncludeLeaf: Dispatch<SetStateAction<boolean>>
    autogenerateKey: () => void
}