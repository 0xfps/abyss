import { useModalStore } from "@/store/modal-store"
import { keccak256 } from "ethers"
import { FaCircle } from "react-icons/fa6"

export function Version() {
    const { setModal } = useModalStore()
    const version = keccak256("0x0002").slice(2, 10)
    return <span className="text-sm flex justify-center items-center p-2 cursor-pointer hover:opacity-80" onClick={() => setModal("VERSION-CHANGELOG")}>
        <FaCircle className="text-btn-success text-[8px] pulser" /> <span className="ml-1">v.{version}</span>
    </span>
}