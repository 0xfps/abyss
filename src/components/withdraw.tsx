"use client"

import { loadImage } from "@/utils/load-image";
import attpConfig from "@fifteenfigures/attp-config";
import { FaGasPump } from "react-icons/fa6";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { useState } from "react";
import { createRandomString } from "@/utils/create-random-string";
import { getChainImage } from "@/utils/get-chain-image";
import { useModalStore } from "@/store/modal-store";

export function Withdraw() {
    const [showUSD, setShowUSD] = useState<boolean>(false)
    const { setModal } = useModalStore()

    function toggleShowUSD() {
        setShowUSD(!showUSD)
    }

    return <div className="w-full p-2">
        <div className="p-2 bg-body h-[120px]">
            <div className="h-[20%]">
                Withdrawal key
            </div>

            <div className="h-[60%] flex">
                <input
                    className="w-full flex justify-start items-center text-3xl tracking-tight"
                    style={{ textTransform: "none" }}
                    value={createRandomString()}
                />
            </div>

            <div className="h-[20%]">
                <span className="cursor-pointer hover:opacity-80">[Paste]</span>
                <span className="cursor-pointer hover:opacity-80 ml-2">[16/16]</span>
                <span className="cursor-pointer hover:opacity-80 ml-2">[Slot 6]</span>
            </div>
        </div>

        <div className="p-2 bg-body h-[120px] mt-2">
            <div className="h-[20%]">
                Secret key
            </div>

            <div className="h-[60%] flex">
                <input
                    className="w-full flex justify-start items-center text-3xl tracking-tight"
                    style={{ textTransform: "none" }}
                    value={createRandomString()}
                />
            </div>

            <div className="h-[20%]">
                <span className="cursor-pointer hover:opacity-80">[Paste]</span>
                <span className="cursor-pointer hover:opacity-80 ml-2">[Hide]</span>
                <span className="cursor-pointer hover:opacity-80 ml-2">[16/16]</span>
            </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        <div className="p-2 bg-body h-[120px] mt-2">
            <div className="h-[20%] flex justify-between">
                <span>
                    You receive
                </span>
                <span className="cursor-pointer hover:opacity-80">
                    [Use Max]
                </span>
            </div>

            <div className="h-[60%] flex">
                <input type="text" className="w-[80%] flex justify-start items-center font-klartext-bold text-5xl tracking-tight" value="25,610.12" />
                <div className="w-[20%] flex justify-end items-center">
                    <div className="relative h-full aspect-square p-2 hover:opacity-80 cursor-pointer" onClick={() => setModal("SWITCH-CHAIN")}>
                        <img src={loadImage(attpConfig.USDC_IMG)} alt="USDC" className="w-full h-full" />
                        <img src={
                            loadImage(getChainImage(421614))
                        } alt="USDC" className="w-[20px] h-[20px] absolute right-1 bottom-1" />
                    </div>
                </div>
            </div>

            <div className="h-[20%] flex justify-between relative">
                <span>
                    $25,609.87
                </span>
                <span>
                    Key Holdings <span onClick={toggleShowUSD}>{!showUSD ? "25,610.12" : "$25,609.87"}</span>
                </span>
            </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        <div className="mt-2">
            <div className="w-full py-1 flex justify-between items-center text-xs">
                <span>Network fee</span>
                <span className="flex items-center">
                    <span><FaGasPump /></span>
                    <span className="ml-2">$2.30</span>
                </span>
            </div>
            <div className="w-full py-1 flex justify-between items-center text-xs">
                <span>Protocol fee</span>
                <span className="flex items-center">
                    <span><BsFillLightningChargeFill /></span>
                    <span className="ml-2">$0.00</span>
                </span>
            </div>
        </div>
        <div className="mt-4">
            <button className="bg-btn-success py-4 w-full text-lg hover:bg-btn-success-hover cursor-pointer" onClick={() => setModal("WITHDRAW-PREVIEW")}>
                Preview withdrawal
            </button>
        </div>
    </div>
}