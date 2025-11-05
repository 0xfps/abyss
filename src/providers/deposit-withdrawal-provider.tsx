import { ChildType } from "@/types/child-type";
import { DepositWithdrawType } from "@/types/deposit-withdraw-type";
import { createRandomString } from "@/utils/create-random-string";
import { createContext, useState } from "react";

export const DepositWithdrawContext = createContext<DepositWithdrawType>({
    includeLeaf: true,
    secretKey: "",
    withdrawalKey: "",
    hidden: true,
    setHidden: () => { },
    setSecretKey: () => { },
    setWithdrawalKey: () => { },
    setIncludeLeaf: () => { },
    autogenerateKey: () => { }
})

export function DepositWithdrawProvider({ children }: ChildType) {
    const [includeLeaf, setIncludeLeaf] = useState<boolean>(true)
    const [hidden, setHidden] = useState<boolean>(true)
    const [secretKey, setSecretKey] = useState<string>("")
    const [withdrawalKey, setWithdrawalKey] = useState<string>("")

    function autogenerateKey() {
        const key = createRandomString()
        setSecretKey(key)
    }

    const values = {
        includeLeaf,
        secretKey,
        withdrawalKey,
        hidden,
        setHidden,
        setIncludeLeaf,
        setSecretKey,
        setWithdrawalKey,
        autogenerateKey
    }

    return <DepositWithdrawContext.Provider value={values}>
        {children}
    </DepositWithdrawContext.Provider>
}