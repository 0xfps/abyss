import { useModalStore } from "@/store/modal-store"

export function Modals() {
    const { modal } = useModalStore()

    return <>
        {modal == "" && <></>}
    </>
}