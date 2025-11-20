"use client"

import { loadImage } from "@/utils/load-image";
import abyssConfig, { Token } from "@fifteenfigures/abyss-config";
import { FaGasPump } from "react-icons/fa6";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useModalStore } from "@/store/modal-store";
import { getChainImage } from "@/utils/get-chain-image";
import { TokenAndAmountContext } from "@/providers/token-and-amount-provider";
import { SwapContext } from "@/providers/swap-provider";
import { useGetPriceData } from "@/hooks/use-get-price-data";
import { useNetworkFee } from "@/hooks/use-network-fee";
import { ChainIdContext } from "@/providers/chain-id-provider";
import { V_TOKEN } from "@/utils/constants";
import { formatToFourDecimals } from "@/utils/to-four-decimals";
import { Loader } from "./loader";
import { formatNumber } from "@/utils/format-number";
import { useVBalance } from "@/hooks/use-v-balance";
import { useAccount, useConfig } from "wagmi";
import { getTokenBalanceFor } from "@/utils/get-token-balance-for";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { DepositWithdrawContext } from "@/providers/deposit-withdrawal-provider";

export function Redeem() {
    const config = useConfig()
    const { address } = useAccount()
    const { setModal, setPrevModal } = useModalStore()
    const { chainId } = useContext(ChainIdContext)
    const {
        tokenToSend,
        tokenToReceive,
        amountToSend,
        amountToReceive,
        setTokenToReceive,
        setAmountToReceive,
        setAmountToSend
    } = useContext(TokenAndAmountContext)

    const { trigger } = useContext(DepositWithdrawContext)

    const {
        usdToggle,
        setUsdToggle,
    } = useContext(SwapContext)

    const [contractAddress, setContractAddress] = useState<string>("")
    const [liquidity, setLiquidity] = useState<number | null>(null)

    const vBalance = useVBalance()
    const { price } = useGetPriceData(tokenToSend)
    const networkFee = useNetworkFee("REDEEM")

    useEffect(function () {
        const swapperAddress = abyssConfig.testnetConfig.chainsConfig[chainId].swapperAddress
        setContractAddress(swapperAddress)
    }, [chainId])

    function toggleShowUSD() {
        setUsdToggle(!usdToggle)
    }

    function showSelectAsset() {
        setModal("SELECT-ASSET")
    }

    useEffect(function () {
        setTokenToReceive(tokenToSend)
    }, [tokenToSend])

    useEffect(function () {
        if (price) {
            if (amountToSend)
                setAmountToReceive(parseFloat((parseFloat(amountToSend) / price).toFixed(4)))
            else setAmountToReceive(0)
        }
    }, [amountToSend, price])

    useEffect(function () {
        setLiquidity(null)

        if (contractAddress && tokenToReceive) {
            loadLiquidity()
        } else setLiquidity(0)
    }, [tokenToReceive, contractAddress, trigger])

    async function loadLiquidity() {
        const balance = await getTokenBalanceFor(contractAddress, config, tokenToReceive)
        setLiquidity(balance)
    }

    function inputAmountToSend(e: ChangeEvent<HTMLInputElement>) {
        const { value } = e.target
        if (!isNaN(Number(value))) {
            setAmountToSend(value)
        }
    }

    function isDisabled(): boolean {
        if (!price) return true
        if (vBalance === null) return true
        if (!parseFloat(amountToSend)) return true
        if (parseFloat(amountToSend) > vBalance) return true
        if (parseFloat(amountToSend) > liquidity!) return true

        return false
    }

    function proceedWithRedemption() {
        if (isDisabled()) return
        setModal("REDEEM-PREVIEW")
    }

    return <div className="w-full p-2">
        <div className="p-2 bg-body h-[120px]">
            <div className="h-[20%] flex justify-between">
                <span>
                    You send
                </span>
                <span className="cursor-pointer hover:opacity-80" onClick={() => { if (vBalance !== null) setAmountToSend(vBalance.toString()) }}>
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
                    <div className="relative h-full aspect-square p-2 hover:opacity-80 cursor-pointer" onClick={() => {
                        setPrevModal("GHOST-MODAL")
                        setModal("SWITCH-CHAIN")
                    }}>
                        <img src={V_TOKEN.image} alt="USDC" className="w-full h-full" />
                        <img src={
                            loadImage(getChainImage(chainId))
                        } alt="USDC" className="w-[20px] h-[20px] absolute right-1 bottom-1" />
                    </div>
                </div>
            </div>

            <div className="h-[20%] flex justify-between">
                <span>
                    ${formatToFourDecimals(parseFloat(amountToSend))}
                </span>
                <span>
                    {
                        (vBalance !== null) ?
                            <span className="cursor-pointer" onClick={toggleShowUSD}>
                                Balance <span>
                                    {!usdToggle
                                        ? `${formatToFourDecimals(vBalance)}`
                                        : `$${formatToFourDecimals(vBalance)}`
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
                    <div className="relative h-full aspect-square p-2 hover:opacity-80 cursor-pointer" onClick={showSelectAsset}>
                        <img src={loadImage(tokenToSend.image)} alt="USDC" className="w-full h-full" />
                        <img src={
                            loadImage(getChainImage(chainId))
                        } alt="USDC" className="w-[20px] h-[20px] absolute right-1 bottom-1" />
                    </div>
                </div>
            </div>

            <div className="h-[20%]">
                ${formatToFourDecimals(parseFloat(amountToSend))}
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
                    <span className="ml-2">{
                        networkFee != null ? `$${formatToFourDecimals(networkFee)}` : <Loader width={40} />
                    }</span>
                </span>
            </div>
            <div className="w-full py-1 flex justify-between items-center text-xs">
                <span>Protocol fee</span>
                <span className="flex items-center">
                    <span><BsFillLightningChargeFill /></span>
                    <span className="ml-2">$0.00</span>
                </span>
            </div>
            <div className="w-full py-1 flex justify-between items-center text-xs">
                <span>Liquidity [${tokenToSend.symbol}]</span>
                <span className="flex items-center">
                    <span><RiMoneyDollarCircleFill className="text-xl" /></span>
                    <span className="ml-2">{
                        liquidity != null ? `${formatToFourDecimals(liquidity)}` : <Loader width={40} />
                    }</span>
                </span>
            </div>
        </div>
        <div className="mt-4">
            <button
                className="bg-btn-success py-4 w-full text-lg hover:bg-btn-success-hover cursor-pointer"
                onClick={proceedWithRedemption}
                style={isDisabled() ? { opacity: "50%", cursor: "not-allowed" } : {}}
            >
                {
                    !address ? "Connect wallet" : "Preview Redemption"
                }
            </button>
        </div>
    </div>
}