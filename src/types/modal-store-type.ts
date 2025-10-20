export type ModalNames = "" | "LEGAL-TOS"

export type ModalStoreType = {
    modal: ModalNames,
    setModal: (name: ModalNames) => void,
    removeModal: () => void
}