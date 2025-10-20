import { useModalStore } from "@/store/modal-store"

export function ConnectWalletButton() {
    const { setModal } = useModalStore()

    function startWalletConnect() {
        setModal("CONNECT-WALLET")
    }

    return <button className="p-2 bg-btn-success cursor-pointer hover:bg-btn-success-hover" onClick={startWalletConnect}>
        Connect Wallet
    </button>
} 