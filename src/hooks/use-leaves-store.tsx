import { useState } from "react";

export function useLeavesStore() {
    const [leaves, setLeaves] = useState<string[]>([])

    function pushLeaves(newLeaves: string[]) {
        setLeaves(prev => [...prev, ...newLeaves])
    }

    return { leaves, setLeaves, pushLeaves }
}