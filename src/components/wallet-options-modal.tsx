"use client"

import Image from "next/image";
import { ModalBg } from "./modal-bg";
import { ModalHeader } from "./modal-header";
import { baseIcon, geminiIcon, metamaskIcon, portoIcon, rabbyIcon, safeIcon, walletConnectIcon } from "../../public";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/providers/global-provider";
import { connect, Connector } from "@wagmi/core"
import { useModalStore } from "@/store/modal-store";

export function WalletConnectionOptions() {
    const { config } = useContext(GlobalContext)
    const { removeModal } = useModalStore()

    const [hasRabby, setHasRabby] = useState<boolean>(false)
    const [
        baseConnector,
        geminiConnector,
        injectedConnector,
        metamaskConnector,
        portoConnector,
        safeConnector,
        walletConnectConnector
    ] = config!.connectors

    useEffect(function () {
        if (window) {
            if (window.ethereum?.isRabby) {
                setHasRabby(true)
            }
        }
    }, [])

    async function connectToWallet(connector: Connector) {
        try {
            const connected = await connect(config!, { connector })
            if (connected) removeModal()
        } catch { }
    }

    return <ModalBg>
        <div>
            <ModalHeader title="Choose a wallet" />

            <div className="flex justify-around items-center mt-4 mb-4">
                {
                    !hasRabby ?
                        <div className="p-2  w-[30%] aspect-square hover:opacity-80 cursor-pointer" onClick={() => connectToWallet(metamaskConnector)}>
                            <Image src={metamaskIcon} alt="Metamask" className="w-full h-full" />
                        </div>
                        : <div className="p-2  w-[30%] aspect-square hover:opacity-80 cursor-pointer" onClick={() => connectToWallet(injectedConnector)}>
                            <Image src={rabbyIcon} alt="Metamask" className="w-full h-full" />
                        </div>
                }
                <div className="p-2  w-[30%] aspect-square hover:opacity-80 cursor-pointer" onClick={() => connectToWallet(portoConnector)}>
                    <Image src={portoIcon} alt="Metamask" className="w-full h-full" />
                </div>
            </div>

            <div className="flex justify-around items-center mt-4 mb-4">
                <div className="p-2  w-[30%] aspect-square hover:opacity-80 cursor-pointer" onClick={() => connectToWallet(baseConnector)}>
                    <Image src={baseIcon} alt="Metamask" className="w-full h-full" />
                </div>
                <div className="p-2  w-[30%] aspect-square hover:opacity-80 cursor-pointer" onClick={() => connectToWallet(safeConnector)}>
                    <Image src={safeIcon} alt="Metamask" className="w-full h-full" />
                </div>
            </div>

            <div className="flex justify-around items-center mt-4 mb-4">
                <div className="p-2  w-[30%] aspect-square hover:opacity-80 cursor-pointer" onClick={() => connectToWallet(walletConnectConnector)}>
                    <Image src={walletConnectIcon} alt="Metamask" className="w-full h-full" />
                </div>
                <div className="p-2  w-[30%] aspect-square hover:opacity-80 cursor-pointer" onClick={() => connectToWallet(geminiConnector)}>
                    <Image src={geminiIcon} alt="Metamask" className="w-full h-full" />
                </div>
            </div>
        </div>
    </ModalBg>
}