import { ModalNames, ModalStoreType } from "@/types/modal-store-type"
import { create } from "zustand"

export const useModalStore = create<ModalStoreType>(
    function (set) {
        return {
            modal: "",
            // Switch and select chain pops up the same modal
            // this is used to keep a record of which modal the
            // select chain modal came from and returns back to it.
            prevModal: "",
            setModal: function (name: ModalNames) {
                return set({
                    modal: name
                })
            },
            setPrevModal: function (name: ModalNames) {
                return set({
                    prevModal: name
                })
            },
            removeModal: function () {
                return set({
                    modal: ""
                })
            }
        }
    }
)