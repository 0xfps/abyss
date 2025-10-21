import { ChildType } from "@/types/child-type";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { useAccount } from "wagmi";

export const ChainIdContext = createContext<{
    pollChainId: number,
    setPollChainId: Dispatch<SetStateAction<number>>,
    removePollChainId: () => void
}>({
    pollChainId: 0,
    setPollChainId: () => { },
    removePollChainId: () => { }
})

export default function ChainIdProvider({ children }: ChildType) {
    const { chainId} = useAccount()
    const [pollChainId, setPollChainId] = useState<number>(chainId || 0)

    function removePollChainId() {
        setPollChainId(0)
    }

    return <ChainIdContext.Provider value={{ pollChainId, setPollChainId, removePollChainId }}>
        {children}
    </ChainIdContext.Provider>
}