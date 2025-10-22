"use client"

import { useModalStore } from "@/store/modal-store";
import { ModalNames } from "@/types/modal-store-type";
import { SlClose } from "react-icons/sl"

export function ModalHeader({ title, newModal }: { title: string, newModal?: ModalNames }) {
    const { setModal, removeModal } = useModalStore()

    function close() {
        if (newModal) setModal(newModal)
        else removeModal()
    }

    return <div className="p-2 flex justify-between items-center">
        <span></span>
        <span className="text-2xl font-klartext-bold">{title}</span>
        <SlClose className="cursor-pointer text-xl hover:opacity-80" onClick={close} />
    </div>
}