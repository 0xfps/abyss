"use client"

import { loadImage } from "@/utils/load-image";
import { FaGasPump } from "react-icons/fa6";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useModalStore } from "@/store/modal-store";
import { getChainImage } from "@/utils/get-chain-image";
import { TokenAndAmountContext } from "@/providers/token-and-amount-provider";
import { useNetworkFee } from "@/hooks/use-network-fee";
import { SwapContext } from "@/providers/swap-provider";
import { useTokenBalance } from "@/hooks/use-token-balance";
import { V_TOKEN } from "@/utils/constants";
import { formatNumber } from "@/utils/format-number";
import { useGetPriceData } from "@/hooks/use-get-price-data";
import { Loader } from "./loader";
import { formatToTwoDecimals } from "@/utils/to-two-decimals";

export function Swap() {
    const { setModal } = useModalStore()
    const {
        tokenToSend,
        amountToSend,
        amountToReceive,
        setAmountToReceive,
        setAmountToSend
    } = useContext(TokenAndAmountContext)

    const {
        usdToggle,
        setUsdToggle,
    } = useContext(SwapContext)

    const tokenBalance = useTokenBalance(tokenToSend)
    const { price } = useGetPriceData(tokenToSend)
    const networkFee = useNetworkFee()

    function toggleShowUSD() {
        setUsdToggle(!usdToggle)
    }

    function showSelectAsset() {
        setModal("SELECT-ASSET")
    }

    useEffect(function () {
        if (price) {
            if (amountToSend)
                setAmountToReceive(price * parseFloat(amountToSend))
            else setAmountToReceive(0)
        }
    }, [amountToSend, price])

    function inputAmountToSend(e: ChangeEvent<HTMLInputElement>) {
        const { value } = e.target
        if (!isNaN(Number(value))) {
            setAmountToSend(value)
        }
    }

    function isDisabled(): boolean {
        if (!price) return true
        if (tokenBalance === null) return true
        if (!parseFloat(amountToSend)) return true
        if (parseFloat(amountToSend) > tokenBalance) return true

        return false
    }

    function proceedWithSwap() {
        if (isDisabled()) return
        setModal("SWAP-PREVIEW")
    }

    return <div className="w-full p-2">
        <div className="p-2 bg-body h-[120px]">
            <div className="h-[20%] flex justify-between">
                <span>
                    You send
                </span>
                <span className="cursor-pointer hover:opacity-80" onClick={() => { if (tokenBalance !== null) setAmountToSend(tokenBalance.toString()) }}>
                    [Use Max]
                </span>
            </div>

            <div className="h-[60%] flex">
                <input
                    type="text"
                    className="w-[80%] flex justify-start items-center font-klartext-bold text-5xl tracking-tight"
                    value={amountToSend}
                    onChange={inputAmountToSend}
                />
                <div className="w-[20%] flex justify-end items-center">
                    <div className="relative h-full aspect-square p-2 hover:opacity-80 cursor-pointer" onClick={showSelectAsset}>
                        <img src={loadImage(tokenToSend.image)} alt="USDC" className="w-full h-full" />
                        <img src={
                            loadImage(getChainImage(tokenToSend.chainId))
                        } alt="USDC" className="w-[20px] h-[20px] absolute right-1 bottom-1" />
                    </div>
                </div>
            </div>

            <div className="h-[20%] flex justify-between">
                <span>
                    {
                        price ? `$${formatToTwoDecimals(price * parseFloat(amountToSend))}` : <Loader />
                    }
                </span>
                <span>
                    {
                        (tokenBalance !== null && price) ?
                            <span className="cursor-pointer" onClick={toggleShowUSD}>
                                Balance <span>
                                    {!usdToggle
                                        ? `${formatToTwoDecimals(tokenBalance)}`
                                        : `$${formatToTwoDecimals(price * tokenBalance)}`
                                    }</span>
                            </span>
                            : <Loader />
                    }
                </span>
            </div>
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        {/*  */}
        <div className="p-2 bg-body h-[120px] mt-2">
            <div className="h-[20%]">
                You receive
            </div>

            <div className="h-[60%] flex">
                <input type="text" className="w-[80%] flex justify-start items-center font-klartext-bold text-5xl tracking-tight" disabled value={formatNumber(amountToReceive)} />
                <div className="w-[20%] flex justify-end items-center">
                    <div className="relative h-full aspect-square p-2">
                        <img src={V_TOKEN.image} alt="V" className="w-full h-full" />
                        <img src={
                            loadImage(getChainImage(tokenToSend.chainId))
                        } alt="USDC" className="w-[20px] h-[20px] absolute right-1 bottom-1" />
                    </div>
                </div>
            </div>

            <div className="h-[20%]">
                {formatNumber(amountToReceive)}
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
                    <span className="ml-2">${networkFee.toFixed(2)}</span>
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
            <button
                className="bg-btn-success py-4 w-full text-lg hover:bg-btn-success-hover cursor-pointer"
                onClick={proceedWithSwap}
                style={isDisabled() ? { opacity: "50%", cursor: "not-allowed" } : {}}
            >
                Preview Swap
            </button>
        </div>
    </div>
}