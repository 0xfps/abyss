"use client"

import { truncateAddress } from "@/utils/truncate-address"
import { useContext, useState } from "react"
import { disconnect } from "@wagmi/core"
import { useConfig } from "wagmi"
import { PollChainIdContext } from "@/providers/poll-chain-id-provider"

export function Address({ address }: { address: string }) {
    const config = useConfig()
    const { removePollChainId } = useContext(PollChainIdContext)
    const [mouseOver, setMouseOver] = useState<boolean>(false)

    async function disconnectWallet() {
        removePollChainId()
        await disconnect(config)
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