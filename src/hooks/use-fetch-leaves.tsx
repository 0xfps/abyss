"use client"

import { LeafFetchType } from "@/types/leaf-fetch-type";
import { DependencyList, useState } from "react";

export function useFetchLeaves({ dependencies }: { dependencies: DependencyList}): LeafFetchType {
    const [leaves, setLeaves] = useState<string[]>([])

    return {
        numberOfLeaves: 6,
        leavesFetched: 0,
        chainId: 0,
    }
}