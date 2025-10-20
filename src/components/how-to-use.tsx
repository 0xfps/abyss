"use client"

import { HOW_TO_USE } from "@/utils/constants";
import { ModalBg } from "./modal-bg";
import { useModalStore } from "@/store/modal-store";

export function HowToUse() {
    const { removeModal } = useModalStore()

    function agree() {
        if (localStorage) {
            localStorage.setItem(HOW_TO_USE, "true")
            removeModal()
        }
    }

    return <ModalBg>
        <div className="w-full mt-4 text-center text-2xl font-klartext-bold">How to use this product</div>
        <p className="mt-8 text-justify font-klartext-light">
            [Read this.]<br /><br />
            1. By using this product (“Service”), you agree to these Terms.
            The Service is provided by [Your Company Name] for lawful, personal use only.
            All content and materials are owned by [Your Company Name] and protected by law.

            <br /><br />

            2. The Service is provided “as is,” without warranties of any kind.
            [Your Company Name] is not liable for any damages, including data loss or interruption,
            arising from use.

            <br /><br />

            3. Use of the Service also means you accept our Privacy Policy.
            We may update these Terms without notice, and continued use implies acceptance.
            These Terms are governed by the laws of [Your Country/State].
        </p>
        <div className="w-full flex items-center justify-center mt-8 mb-4 font-klartext-light">
            <button className="py-4 md:py-3 bg-modal-btn cursor-pointer hover:bg-modal-btn-hover px-8" onClick={agree}>
                Let's start movin'
            </button>
        </div>
    </ModalBg>
}