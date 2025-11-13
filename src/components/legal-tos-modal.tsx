"use client"

import { useState } from "react";
import { ModalBg } from "./modal-bg";
import { LEGAL_TOS } from "@/utils/constants";
import { useModalStore } from "@/store/modal-store";

export function LegalTOSModal() {
    const { setModal } = useModalStore()
    const [checked, setChecked] = useState<boolean>(false)

    function toggleCheck() {
        setChecked(!checked)
    }

    function agree() {
        if (checked && localStorage) {
            localStorage.setItem(LEGAL_TOS, "true")
            setModal("HOW-TO-USE")
        }
    }

    return <ModalBg>
        <div className="w-full mt-4 text-center text-2xl font-klartext-bold">Legal and Terms Of Service</div>
        <p className="mt-8 text-justify font-klartext-light">
            By using Abyss (“Service”), you agree to these Terms.
            The Service is intended for lawful, personal use only.
            All content and materials within the Service are protected by applicable laws.
            The Service is provided “as is,” without any warranties or guarantees of any kind.
            The creators of the Service are not liable for any damages, including data loss, service interruptions, or other issues arising from its use.
            Use of the Service also signifies your acceptance of the Privacy Policy.
            These Terms may be updated at any time without prior notice, and continued use of the Service constitutes acceptance of any changes.
            These Terms are governed by the laws of the relevant jurisdiction.
        </p>
        <div className="mt-4 flex justify-start items-center cursor-pointer" onClick={toggleCheck}>
            <div className="w-[20px] h-[20px] p-[2px] border-1 border-modal-border cursor-pointer">
                <div className={checked ? `w-full h-full bg-modal-btn` : ""}></div>
            </div>
            <span className="ml-2">I Agree.</span>
        </div>
        <div className="w-full flex items-center justify-center mt-8 mb-4 font-klartext-light">
            <button
                className={`py-4 md:py-3 bg-modal-btn
                ${!checked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-modal-btn-hover"} 
                px-8`}
                disabled={!checked}
                onClick={agree}
            >
                I understand, close
            </button>
        </div>
    </ModalBg>
}