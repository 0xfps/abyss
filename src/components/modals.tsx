"use client"

import { useModalStore } from "@/store/modal-store"
import { LegalTOSModal } from "./legal-tos-modal"
import { HowToUse } from "./how-to-use"
import { WalletConnectionOptions } from "./wallet-options-modal"
import { SwitchChainModal } from "./select-chain-modal"
import { SelectAssetModal } from "./select-asset-modal"

export function Modals() {
    const { modal } = useModalStore()

    return <>
        {modal == "" && <></>}
        {modal == "LEGAL-TOS" && <LegalTOSModal />}
        {modal == "HOW-TO-USE" && <HowToUse />}
        {modal == "CONNECT-WALLET" && <WalletConnectionOptions />}
        {modal == "SWITCH-CHAIN" && <SwitchChainModal />}
        { modal == "SELECT-ASSET" && <SelectAssetModal/>}
    </>
}