import { ChildType } from "@/types/child-type";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { useAccount } from "wagmi";

export const PollChainIdContext = createContext<{
    pollChainId: number,
    setPollChainId: Dispatch<SetStateAction<number>>,
    removePollChainId: () => void
}>({
    pollChainId: 0,
    setPollChainId: () => { },
    removePollChainId: () => { }
})

export default function PollChainIdProvider({ children }: ChildType) {
    const { chainId } = useAccount()
    const [pollChainId, setPollChainId] = useState<number>(chainId || 0)

    function removePollChainId() {
        setPollChainId(0)
    }

    return <PollChainIdContext.Provider value={{ pollChainId, setPollChainId, removePollChainId }}>
        {children}
    </PollChainIdContext.Provider>
}