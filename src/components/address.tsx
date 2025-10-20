"use client"

import { truncateAddress } from "@/utils/truncate-address"
import { useContext, useState } from "react"
import { disconnect } from "@wagmi/core"
import { GlobalContext } from "@/providers/global-provider"

export function Address({ address }: { address: string }) {
    const { config } = useContext(GlobalContext)
    const [mouseOver, setMouseOver] = useState<boolean>(false)

    async function disconnectWallet() {
        await disconnect(config!)
    }

    return <button
        className="border-btn-success border-1 p-2 cursor-pointer hover:border-btn-success-hover w-[200px]"
        onMouseOver={() => setMouseOver(true)}
        onMouseOut={() => setMouseOver(false)}
        onClick={disconnectWallet}
    >

        {!mouseOver ? truncateAddress(address, 6) : "Disconnect"}
    </button>
}