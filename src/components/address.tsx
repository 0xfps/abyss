import { truncateAddress } from "@/utils/truncate-address"
import { useState } from "react"

export function Address() {
    const address = "0x3dA570D3dc5EEf7b4658C2ca3FC63a42360DC514"
    const [mouseOver, setMouseOver] = useState<boolean>(false)

    return <button
        className="border-btn-success border-1 p-2 cursor-pointer hover:border-btn-success-hover w-[200px]"
        onMouseOver={() => setMouseOver(true)}
        onMouseOut={() => setMouseOver(false)}
    >
        
        {!mouseOver ? truncateAddress(address, 6) : "Disconnect"}
    </button>
}