import { useModalStore } from "@/store/modal-store";
import { SlClose } from "react-icons/sl"

export function ModalHeader({ title }: { title: string }) {
    const { removeModal } = useModalStore()

    function close() {
        removeModal()
    }

    return <div className="p-2 flex justify-between items-center">
        <span></span>
        <span className="text-2xl font-klartext-bold">{title}</span>
        <SlClose className="cursor-pointer text-xl hover:opacity-80" onClick={close} />
    </div>
}