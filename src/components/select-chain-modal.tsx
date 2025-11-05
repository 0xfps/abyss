"use client"

import attpConfig from "@fifteenfigures/attp-config"
import { ModalBg } from "./modal-bg"
import { ModalHeader } from "./modal-header"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { loadImage } from "@/utils/load-image"
import { PollChainIdContext } from "@/providers/poll-chain-id-provider"
import { useModalStore } from "@/store/modal-store"
import { ChainIdContext } from "@/providers/chain-id-provider"
import { ChainArr } from "@/types/chain-array-type"

/**
 * This modal is flexible and does two things at once.
 * Caution!
 */
export function SwitchChainModal() {
    const chains = attpConfig.testnetConfig.chains
    const [chainStore, setChainStore] = useState<ChainArr[]>([])
    const [chainArr, setChainArr] = useState<ChainArr[]>([])
    const { pollChainId, setPollChainId } = useContext(PollChainIdContext)
    const { chainId, setChainId } = useContext(ChainIdContext)
    const { prevModal, setModal } = useModalStore()
    // Is true if the previous modal is empty, meaning it was called from the [SWITCH]
    // to change the poll chain.
    const [calledOnSwitchPollChain,] = useState<boolean>(prevModal == "")
    // Whenever the modal is up, irrespective of where it was called from,
    // this will hold the Id of the chain, which can either be the poll chain,
    // if it was from there, or the action chain Id, if it was from there.
    const [alreadySelectedChainId,] = useState<number>(calledOnSwitchPollChain ? pollChainId : chainId)
    const [search, setSearch] = useState<string>("")

    useEffect(function () {
        const chainArr = chains.map(function ({ id, name }) {
            const image = attpConfig.testnetConfig.chainsConfig[id].image as string
            return { name: name.split(" ")[0], image, id }
        })

        setChainArr(chainArr)
        setChainStore(chainArr)
    }, [])

    function selectChain(id: number) {
        if (calledOnSwitchPollChain)
            setPollChainId(id)
        else setChainId(id)

        setModal(prevModal)
    }

    function searchForChain(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.toLowerCase()
        setSearch(value)

        if (!value) {
            setChainArr(chainStore)
            return
        }

        const filteredChains = chainStore.filter(function ({ name }) {
            return name.toLowerCase().includes(value)
        })

        setChainArr(filteredChains)
    }

    return <ModalBg>
        <div>
            <ModalHeader title="Select chain" />
            <input
                type="text"
                className="w-full bg-body p-2 placeholder:opacity-50 mt-2"
                placeholder="Search for chain"
                value={search}
                onChange={searchForChain}
            />
            <div
                className="mt-2 p-2 grid grid-cols-2 md:grid-cols-3
                gap-x-2 gap-y-4 overflow-y-scroll max-h-[60vh]
                md:max-h-[50vh]"
            >
                {chainArr.map(function ({ id, name, image }: ChainArr, index: number) {
                    return <div
                        className="p-2 grid-cols-1 flex justify-start items-center 
                            cursor-pointer border border-transparent bg-body
                            hover:opacity-80  hover:border-modal-btn-hover h-[60px] md:h-[50px]"
                        key={index}
                        style={(id == alreadySelectedChainId) ? { border: "1px solid #7E8321" } : {}} // Not really poll chain Id, but for this test.
                        onClick={() => selectChain(id)}
                    >
                        <img src={loadImage(image)} alt={name} className="w-[30px] h-[30px]" />
                        <span className="ml-3">{name}</span>
                    </div>
                })}
            </div>
        </div>
    </ModalBg>
}