export type ModalNames = "" |
    "LEGAL-TOS" |
    "HOW-TO-USE" |
    "CONNECT-WALLET"

export type ModalStoreType = {
    modal: ModalNames,
    setModal: (name: ModalNames) => void,
    removeModal: () => void
}