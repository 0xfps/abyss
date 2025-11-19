"use client"

import Image from "next/image";
import { ModalBg } from "./modal-bg";
import { ModalHeader } from "./modal-header";
import { baseIcon, geminiIcon, metamaskIcon, portoIcon, rabbyIcon, safeIcon, walletConnectIcon } from "../../public";
import { useContext, useEffect, useState } from "react";
import { connect, Connector } from "@wagmi/core"
import { useModalStore } from "@/store/modal-store";
import { useConfig } from "wagmi";
import { PollChainIdContext } from "@/providers/poll-chain-id-provider";

export function WalletConnectionOptions() {
    const config = useConfig()
    const { prevModal, setModal } = useModalStore()
    const { pollChainId, setPollChainId } = useContext(PollChainIdContext)

    const [hasRabby, setHasRabby] = useState<boolean>(false)
    const [
        baseConnector,
        // geminiConnector,
        injectedConnector,
        metamaskConnector,
        portoConnector,
        // safeConnector,
        walletConnectConnector
    ] = config.connectors

    useEffect(function () {
        if (window) {
            if (window.ethereum?.isRabby) {
                setHasRabby(true)
            }
        }
    }, [])

    async function connectToWallet(connector: Connector) {
        try {
            const connected = await connect(config, { connector })
            if (connected) {
                const chainId = connected.chainId
                if (!pollChainId)
                    setPollChainId(chainId)
                setModal(prevModal)
            }
        } catch { }
    }

    return <ModalBg>
        <div>
            <ModalHeader title="Choose a wallet" />

            <div className="flex justify-around items-center mt-4 mb-4">
                {
                    !hasRabby ?
                        <div className="p-2 w-[20%] aspect-square hover:opacity-80 cursor-pointer" title="Metamask Wallet" onClick={() => connectToWallet(metamaskConnector)}>
                            <Image src={metamaskIcon} alt="Metamask Wallet" className="w-full h-full" />
                        </div>
                        : <div className="p-2 w-[20%] aspect-square hover:opacity-80 cursor-pointer" title="Rabby Wallet" onClick={() => connectToWallet(injectedConnector)}>
                            <Image src={rabbyIcon} alt="Rabby Wallet" className="w-full h-full" />
                        </div>
                }
                <div className="p-2 w-[20%] aspect-square hover:opacity-80 cursor-pointer" title="Porto Wallet" onClick={() => connectToWallet(portoConnector)}>
                    <Image src={portoIcon} alt="Porto Wallet" className="w-full h-full" />
                </div>
            </div>

            <div className="flex justify-around items-center mt-4 mb-4">
                <div className="p-2 w-[20%] aspect-square hover:opacity-80 cursor-pointer" title="Base Wallet" onClick={() => connectToWallet(baseConnector)}>
                    <Image src={baseIcon} alt="Base Wallet" className="w-full h-full" />
                </div>
                {/* <div className="p-2 w-[20%] aspect-square hover:opacity-80 cursor-pointer" title="Safe Wallet" onClick={() => connectToWallet(safeConnector)}>
                    <Image src={safeIcon} alt="Safe Wallet" className="w-full h-full" />
                </div> */}
                <div className="p-2 w-[20%] aspect-square hover:opacity-80 cursor-pointer" title="Wallet Connect" onClick={() => connectToWallet(walletConnectConnector)}>
                    <Image src={walletConnectIcon} alt="Wallet Connect" className="w-full h-full" />
                </div>
            </div>

            {/* <div className="flex justify-around items-center mt-4 mb-4">
                <div className="p-2 w-[20%] aspect-square hover:opacity-80 cursor-pointer" title="Wallet Connect" onClick={() => connectToWallet(walletConnectConnector)}>
                    <Image src={walletConnectIcon} alt="Wallet Connect" className="w-full h-full" />
                </div>
                <div className="p-2 w-[20%] aspect-square hover:opacity-80 cursor-pointer" title="Gemini" onClick={() => connectToWallet(geminiConnector)}>
                    <Image src={geminiIcon} alt="Gemini" className="w-full h-full" />
                </div>
            </div> */}
        </div>
    </ModalBg>
}