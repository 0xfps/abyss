import { useContext, useEffect, useState } from "react";
import { ModalBg } from "./modal-bg";
import { ModalHeader } from "./modal-header";
import { ChainIdContext } from "@/providers/chain-id-provider";
import { useModalStore } from "@/store/modal-store";
import attpConfig, { Token } from "@fifteenfigures/attp-config";
import { ChainArr } from "@/types/chain-array-type";
import { loadImage } from "@/utils/load-image";

export function SelectAssetModal() {
    const chains = attpConfig.testnetConfig.chains.slice(0, 6)
    const [chainArr, setChainArr] = useState<ChainArr[]>([])
    const { chainId, setChainId } = useContext(ChainIdContext)
    const [assets, setAssets] = useState<Token[]>([])
    const { setModal, setPrevModal, removeModal } = useModalStore()

    useEffect(function () {
        chains.forEach(function ({ id, name }) {
            const image = attpConfig.testnetConfig.chainsConfig[id].image as string
            setChainArr(prev => [
                ...prev,
                { name: name.split(" ")[0], image, id }
            ])
        })
    }, [])

    useEffect(function () {
        const assets = Object.values(attpConfig.testnetConfig.chainsConfig[chainId].tokens)
        setAssets(assets)
    }, [chainId])

    function showMoreChains() {
        setPrevModal("SELECT-ASSET")
        setModal("SWITCH-CHAIN")
    }

    return <ModalBg>
        <div>
            <ModalHeader title="Select asset" />
            <div
                className="mt-2 p-2 grid grid-cols-2 md:grid-cols-3
                            gap-x-2 gap-y-4"
            >
                {chainArr.map(function ({ id, name, image }: ChainArr, index: number) {
                    return <div
                        className="p-2 grid-cols-1 flex justify-start items-center 
                                        cursor-pointer border border-transparent bg-body
                                        hover:opacity-80  hover:border-modal-btn-hover h-[60px] md:h-[50px]"
                        key={index}
                        style={(id == chainId) ? { border: "1px solid #7E8321" } : {}} // Not really poll chain Id, but for this test.
                        onClick={() => setChainId(id)}
                    >
                        <img src={loadImage(image)} alt={name} className="w-[30px] h-[30px]" />
                        <span className="ml-3">{name}</span>
                    </div>
                })}
            </div>
            <div className="p-2">
                <div className="mt-1 bg-modal-btn p-2 w-full text-center cursor-pointer" onClick={showMoreChains}>
                    Show more chains
                </div>
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="p-2">
                <input type="text" className="w-full bg-body p-2 placeholder:opacity-50 mt-2" value="" placeholder="Search for asset" />
            </div>
            <div
                className="mt-2 p-2 grid grid-cols-2 md:grid-cols-3
                            gap-x-2 gap-y-4 h-[30vh]
                            md:h-[40vh] overflow-y-scroll"
            >
                {assets.map(function (asset: Token, index: number) {
                    const { image, symbol } = asset
                    return <div
                        className="p-2 grid-cols-1 flex justify-start items-center 
                                        cursor-pointer border border-transparent bg-body
                                        hover:opacity-80  hover:border-modal-btn-hover h-[60px] md:h-[50px]"
                        key={index}
                        style={(index == chainId) ? { border: "1px solid #7E8321" } : {}} // @todo
                        onClick={() => removeModal()}
                    >
                        <img src={loadImage(image)} alt={symbol} className="w-[30px] h-[30px]" />
                        <span className="ml-3">{symbol}</span>
                    </div>
                })}
            </div>
        </div>
    </ModalBg>
}