import { useState } from "react";
import { ModalBg } from "./modal-bg";

export function LegalTOSModal() {
    const [checked, setChecked] = useState<boolean>(false)

    function toggleCheck() {
        setChecked(!checked)
    }

    return <ModalBg>
        <div className="w-full mt-4 text-center text-2xl font-klartext-bold">Legal and Terms Of Service</div>
        <p className="mt-8 text-justify font-klartext-light">
            [Update this.]<br /><br />
            By using this product (“Service”), you agree to these Terms.
            The Service is provided by [Your Company Name] for lawful, personal use only.
            All content and materials are owned by [Your Company Name] and protected by law.
            The Service is provided “as is,” without warranties of any kind.
            [Your Company Name] is not liable for any damages, including data loss or interruption,
            arising from use. Use of the Service also means you accept our Privacy Policy.
            We may update these Terms without notice, and continued use implies acceptance.
            These Terms are governed by the laws of [Your Country/State].
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
            >
                I understand, close
            </button>
        </div>
    </ModalBg>
}