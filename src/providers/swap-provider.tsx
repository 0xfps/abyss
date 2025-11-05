import { ChildType } from "@/types/child-type";
import { SwapContextType } from "@/types/swap-context-type";
import { createContext, useState } from "react";

export const SwapContext = createContext<SwapContextType>({
    usdToggle: false,
    price: 0,
    updateFeeData: [],
    setUsdToggle: () => { }
})

export function SwapProvider({ children }: ChildType) {
    const [usdToggle, setUsdToggle] = useState<boolean>(false)
    const [updateFeeData, setUpdateFeeData] = useState<string[]>([])
    const [price, setPrice] = useState<number | null>(null)

    const values = {
        usdToggle,
        price,
        setUsdToggle,
        updateFeeData
    }

    return <SwapContext.Provider value={values}>
        {children}
    </SwapContext.Provider>
}