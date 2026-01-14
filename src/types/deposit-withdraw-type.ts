import { Dispatch, SetStateAction } from "react"

export type DepositWithdrawType = {
    includeLeaf: boolean
    splitDeposit: boolean
    secretKey: string
    withdrawalKey: string,
    depositKeys: string[],
    withdrawalKeys: string[],
    hidden: boolean,
    trigger: number,
    pullTrigger: () => void,
    setHidden: Dispatch<SetStateAction<boolean>>
    setSecretKey: Dispatch<SetStateAction<string>>
    setWithdrawalKey: Dispatch<SetStateAction<string>>
    setDepositKeys: Dispatch<SetStateAction<string[]>>
    setWithdrawalKeys: Dispatch<SetStateAction<string[]>>
    setIncludeLeaf: Dispatch<SetStateAction<boolean>>
    setSplitDeposit: Dispatch<SetStateAction<boolean>>
    autogenerateKey: () => void
}