import { ModalNames, ModalStoreType } from "@/types/modal-store-type"
import { create } from "zustand"

export const useModalStore = create<ModalStoreType>(
    function (set) {
        return {
            modal: "",
            setModal: function (name: ModalNames) {
                return set({
                    modal: name
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