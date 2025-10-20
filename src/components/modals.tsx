import { useModalStore } from "@/store/modal-store"
import { LegalTOSModal } from "./legal-tos-modal"
import { HowToUse } from "./how-to-use"

export function Modals() {
    const { modal } = useModalStore()

    return <>
        {modal == "" && <></>}
        {modal == "LEGAL-TOS" && <LegalTOSModal />}
        {modal == "HOW-TO-USE" && <HowToUse />}
    </>
}