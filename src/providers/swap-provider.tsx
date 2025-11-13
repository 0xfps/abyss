import { ChildType } from "@/types/child-type";
import { SwapContextType } from "@/types/swap-context-type";
import { createContext, useState } from "react";

export const SwapContext = createContext<SwapContextType>({
    usdToggle: false,
    setUsdToggle: () => { }
})

export function SwapProvider({ children }: ChildType) {
    const [usdToggle, setUsdToggle] = useState<boolean>(false)

    const values = {
        usdToggle,
        setUsdToggle
    }

    return <SwapContext.Provider value={values}>
        {children}
    </SwapContext.Provider>
}