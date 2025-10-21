"use client"

import { getProjectId } from "@/server/get-project-id";
import { ChildType } from "@/types/child-type";
import createWagmiConfig from "@/utils/create-wagmi-config";
import { createContext, useEffect, useState } from "react";
import { Config } from "@wagmi/core";
import { AOSProvider } from "./aos-provider";
import LegalTOSProvider from "./legal-tos-provider";
import { Modals } from "@/components/modals";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChainIdProvider from "./chain-id-provider";

export const GlobalContext = createContext<"">("")

const queryClient = new QueryClient()

export default function GlobalProvider({ children }: ChildType) {
    const [config, setConfig] = useState<Config | undefined>(undefined)

    useEffect(function () {
        if (!config) loadProjectId()
    }, [])

    async function loadProjectId() {
        const projectId = await getProjectId()
        const wagmiConfig = createWagmiConfig(projectId)
        setConfig(wagmiConfig)
    }

    return config && <GlobalContext.Provider value={""}>
        <AOSProvider>
            <LegalTOSProvider>
                <WagmiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                        <ChainIdProvider>
                            <Modals />
                            {children}
                        </ChainIdProvider>
                    </QueryClientProvider>
                </WagmiProvider>
            </LegalTOSProvider>
        </AOSProvider>
    </GlobalContext.Provider>
}