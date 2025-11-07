import { ChildType } from "@/types/child-type";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export const LeavesContext = createContext<{
    leaves: string[],
    setLeaves: Dispatch<SetStateAction<string[]>>
    pushLeaves: (newLeaves: string[]) => void
}>({
    leaves: [],
    setLeaves: () => { },
    pushLeaves: () => { },
})

export function LeavesContextProvider({ children }: ChildType) {
    const [leaves, setLeaves] = useState<string[]>([])

    function pushLeaves(newLeaves: string[]) {
        setLeaves(prev => [...prev, ...newLeaves])
    }

    const values = { leaves, setLeaves, pushLeaves }
    console.log({ leaves })

    return <LeavesContext.Provider value={values}>
        {children}
    </LeavesContext.Provider>
}