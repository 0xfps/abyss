import { ChildType } from "@/types/child-type";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { arbitrumSepolia } from "viem/chains";

export const ChainIdContext = createContext<{
    chainId: number,
    setChainId: Dispatch<SetStateAction<number>>,
}>({ chainId: 0, setChainId: () => { } })

export function ChainIdProvider({ children }: ChildType) {
    const [chainId, setChainId] = useState<number>(arbitrumSepolia.id)

    return <ChainIdContext.Provider value={{ chainId, setChainId }}>
        {children}
    </ChainIdContext.Provider>
}