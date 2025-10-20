import { useModalStore } from "@/store/modal-store";
import { ChildType } from "@/types/child-type";
import { HOW_TO_USE, LEGAL_TOS } from "@/utils/constants"
import { createContext, useEffect } from "react"

export const LegalTOSContext = createContext<"">("")

export default function LegalTOSProvider({ children }: ChildType) {
    const { setModal } = useModalStore()

    useEffect(function () {
        if (localStorage) {
            const hasAgreedToTOS = localStorage.getItem(LEGAL_TOS)
            const hasReadHowToUse = localStorage.getItem(HOW_TO_USE)

            console.log({ hasAgreedToTOS, hasReadHowToUse })

            if (hasAgreedToTOS !== "true") {
                setModal("LEGAL-TOS")
            } else {
                if (hasReadHowToUse !== "true") {
                    setModal("HOW-TO-USE")
                }
            }
        }
    }, [])

    return <LegalTOSContext.Provider value="">
        {children}
    </LegalTOSContext.Provider>

}