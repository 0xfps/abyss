export type ModalNames = "" |
    "LEGAL-TOS" |
    "HOW-TO-USE" |
    "CONNECT-WALLET" |
    "SWITCH-CHAIN" |
    "SELECT-ASSET" |
    "DEPOSIT-PREVIEW" |
    "WITHDRAW-PREVIEW" |
    "SWAP-PREVIEW" |
    "DEPOSIT-SUCCESS" |
    "VERSION-CHANGELOG"

export type ModalStoreType = {
    modal: ModalNames,
    prevModal: ModalNames,
    setModal: (name: ModalNames) => void,
    setPrevModal: (name: ModalNames) => void,
    removeModal: () => void
}