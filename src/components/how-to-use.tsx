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
            This is a mixer, a privacy protocol that breaks the on-chain link between deposits and withdrawals.
            By using cryptographic proofs and secret keys, it ensures that when you deposit and later withdraw, there’s no traceable connection between the two. Your transactions remain fully private, verifiable, and under your control.

            <br /><br />

            <span className="font-klartext-medium">Here’s how it works:</span>

            <br /><br />

            <span className="font-klartext-medium">1. Swap your Testnet asset for $ABYSS.</span><br />
            Exchange your Testnet tokens for $ABYSS, the private token used within the mixer.


            <br /><br />

            <span className="font-klartext-medium">2. Deposit $ABYSS with a secret key.</span><br />
            Your deposit generates unique withdrawal keys. Download and store them securely; they’re required to withdraw your funds later.


            <br /><br />

            <span className="font-klartext-medium">3. Withdraw $ABYSS anytime.</span><br />
            Use your secret and any of your withdrawal keys to retrieve your funds privately, with no link to your original deposit.
        </p>
        <div className="w-full flex items-center justify-center mt-8 mb-4 font-klartext-light">
            <button className="py-4 md:py-3 bg-modal-btn cursor-pointer hover:bg-modal-btn-hover px-8" onClick={agree}>
                Let's start movin'
            </button>
        </div>
    </ModalBg>
}