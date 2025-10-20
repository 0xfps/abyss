export type ModalNames = "" | "LEGAL-TOS" | "HOW-TO-USE"

export type ModalStoreType = {
    modal: ModalNames,
    setModal: (name: ModalNames) => void,
    removeModal: () => void
}