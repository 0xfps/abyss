import { ChildType } from "@/types/child-type";
import { DEFAULT_CHAIN_ID } from "@/utils/constants";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export const ChainIdContext = createContext<{
    chainId: number,
    setChainId: Dispatch<SetStateAction<number>>,
}>({ chainId: 0, setChainId: () => { } })

export function ChainIdProvider({ children }: ChildType) {
    const [chainId, setChainId] = useState<number>(DEFAULT_CHAIN_ID)

    return <ChainIdContext.Provider value={{ chainId, setChainId }}>
        {children}
    </ChainIdContext.Provider>
}