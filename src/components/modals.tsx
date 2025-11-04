"use client"

import { useModalStore } from "@/store/modal-store"
import { LegalTOSModal } from "./legal-tos-modal"
import { HowToUse } from "./how-to-use"
import { WalletConnectionOptions } from "./wallet-options-modal"
import { SwitchChainModal } from "./select-chain-modal"
import { SelectAssetModal } from "./select-asset-modal"
import { SwapPreview } from "./swap-preview"
import { DepositPreview } from "./deposit-preview"
import { WithdrawPreview } from "./withdraw-preview"
import { VersionChangeLog } from "./version-changelog"
import { RedeemPreview } from "./redeem-preview"

export function Modals() {
    const { modal } = useModalStore()

    return <>
        {modal == "" && <></>}
        {modal == "GHOST-MODAL" && <></>}
        {modal == "LEGAL-TOS" && <LegalTOSModal />}
        {modal == "HOW-TO-USE" && <HowToUse />}
        {modal == "CONNECT-WALLET" && <WalletConnectionOptions />}
        {modal == "SWITCH-CHAIN" && <SwitchChainModal />}
        {modal == "SELECT-ASSET" && <SelectAssetModal />}
        {modal == "SWAP-PREVIEW" && <SwapPreview />}
        {modal == "REDEEM-PREVIEW" && <RedeemPreview />}
        {modal == "DEPOSIT-PREVIEW" && <DepositPreview />}
        {modal == "WITHDRAW-PREVIEW" && <WithdrawPreview />}
        {modal == "VERSION-CHANGELOG" && <VersionChangeLog />}
    </>
}