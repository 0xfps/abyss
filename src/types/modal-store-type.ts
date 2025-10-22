export type ModalNames = "" |
    "LEGAL-TOS" |
    "HOW-TO-USE" |
    "CONNECT-WALLET" |
    "SWITCH-CHAIN" |
    "DEPOSIT-PREVIEW" |
    "WITHDRAWAL-PREVIEW" |
    "SWAP-PREVIEW" |
    "SELECT ASSET"

export type ModalStoreType = {
    modal: ModalNames,
    prevModal: ModalNames,
    setModal: (name: ModalNames) => void,
    setPrevModal: (name: ModalNames) => void,
    removeModal: () => void
}