import { ChildType } from "@/types/child-type";
import { DepositWithdrawType } from "@/types/deposit-withdraw-type";
import { createRandomString } from "@/utils/create-random-string";
import { createContext, useState } from "react";

export const DepositWithdrawContext = createContext<DepositWithdrawType>({
    includeLeaf: true,
    secretKey: "",
    withdrawalKey: "",
    withdrawalKeys: [],
    hidden: true,
    trigger: 0,
    pullTrigger: () => { },
    setHidden: () => { },
    setSecretKey: () => { },
    setWithdrawalKey: () => { },
    setWithdrawalKeys: () => { },
    setIncludeLeaf: () => { },
    autogenerateKey: () => { }
})

export function DepositWithdrawProvider({ children }: ChildType) {
    const [includeLeaf, setIncludeLeaf] = useState<boolean>(true)
    const [hidden, setHidden] = useState<boolean>(true)
    const [secretKey, setSecretKey] = useState<string>("")
    const [withdrawalKey, setWithdrawalKey] = useState<string>("")
    const [withdrawalKeys, setWithdrawalKeys] = useState<string[]>([])
    const [trigger, setTrigger] = useState<number>(0)

    function autogenerateKey() {
        const key = createRandomString()
        setSecretKey(key)
    }

    function pullTrigger() {
        const random = Math.floor(Math.random() * 1_000_000_000)
        setTrigger(random)
    }

    const values = {
        includeLeaf,
        secretKey,
        withdrawalKey,
        withdrawalKeys,
        hidden,
        trigger,
        pullTrigger,
        setHidden,
        setIncludeLeaf,
        setSecretKey,
        setWithdrawalKey,
        setWithdrawalKeys,
        autogenerateKey
    }

    return <DepositWithdrawContext.Provider value={values}>
        {children}
    </DepositWithdrawContext.Provider>
}