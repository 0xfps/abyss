"use client"

import { truncateAddress } from "@/utils/truncate-address"
import { useState } from "react"
import { disconnect } from "@wagmi/core"
import { useConfig } from "wagmi"

export function Address({ address }: { address: string }) {
    const config = useConfig()
    const [mouseOver, setMouseOver] = useState<boolean>(false)

    async function disconnectWallet() {
        await disconnect(config!)
    }

    return <button
        className="border-btn-success border p-2 cursor-pointer hover:border-btn-success-hover w-[200px]"
        onMouseOver={() => setMouseOver(true)}
        onMouseOut={() => setMouseOver(false)}
        onClick={disconnectWallet}
    >

        {!mouseOver ? truncateAddress(address, 6) : "Disconnect"}
    </button>
}