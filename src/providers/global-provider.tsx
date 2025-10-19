"use client"

import { getProjectId } from "@/server/get-project-id";
import { ChildType } from "@/types/child-type";
import { GlobalContextType } from "@/types/global-context-type";
import createWagmiConfig from "@/utils/create-wagmi-config";
import { createContext, useEffect, useState } from "react";
import { Config } from "wagmi";

export const GlobalContext = createContext<GlobalContextType>({
    config: undefined
})

export default function GlobalProvider({ children }: ChildType) {
    const [config, setConfig] = useState<Config | undefined>(undefined)

    useEffect(function () {
        loadProjectId()
    }, [])

    async function loadProjectId() {
        const projectId = await getProjectId()
        const wagmiConfig = createWagmiConfig(projectId)
        setConfig(wagmiConfig)
    }

    return config && <GlobalContext.Provider value={{ config }}>
        {children}
    </GlobalContext.Provider>
}