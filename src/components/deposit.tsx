"use client"

import { loadImage } from "@/utils/load-image";
import { FaGasPump, FaToggleOff } from "react-icons/fa6";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { getChainImage } from "@/utils/get-chain-image";
import { useModalStore } from "@/store/modal-store";
import { FaToggleOn } from "react-icons/fa6";
import { DepositWithdrawContext } from "@/providers/deposit-withdrawal-provider";
import { ChainIdContext } from "@/providers/chain-id-provider";
import { DECIMALS, V_TOKEN } from "@/utils/constants";
import { useVBalance } from "@/hooks/use-v-balance";
import { TokenAndAmountContext } from "@/providers/token-and-amount-provider";
import { formatToFourDecimals } from "@/utils/to-four-decimals";
import { Loader } from "./loader";
import { useNetworkFee } from "@/hooks/use-network-fee";
import { breakDownKey, generateKeys } from "@fifteenfigures/tiny-merkle-tree"
import { formatNumber } from "@/utils/format-number";
import { useAccount } from "wagmi";

export function Deposit() {
    const { address } = useAccount()
    const [showUSD, setShowUSD] = useState<boolean>(false)
    const { setModal, setPrevModal } = useModalStore()
    const { chainId } = useContext(ChainIdContext)
    const [secretKeyCount, setSecretKeyCount] = useState<number>(0)
    const vBalance = useVBalance()
    const {
        amountToSend,
        setAmountToSend
    } = useContext(TokenAndAmountContext)

    const {
        secretKey,
        splitDeposit,
        hidden,
        setHidden,
        setSplitDeposit,
        setSecretKey,
        setWithdrawalKey,
        setDepositKeys,
        setWithdrawalKeys,
        autogenerateKey
    } = useContext(DepositWithdrawContext)
    const networkFee = useNetworkFee("DEPOSIT")

    useEffect(function () {
        setSecretKeyCount(secretKey.length)
    }, [secretKey])

    function toggleShowUSD() {
        setShowUSD(!showUSD)
    }

    function toggleHide() {
        setHidden(!hidden)
    }

    function inputAmountToSend(e: ChangeEvent<HTMLInputElement>) {
        const { value } = e.target
        if (!isNaN(Number(value))) {
            setAmountToSend(value)
        }
    }

    function inputSecretKey(e: ChangeEvent<HTMLInputElement>) {
        const secret = e.target.value.slice(0, 16)
        setSecretKey(secret)
    }

    async function pasteKey() {
        const clipboardContents = await navigator.clipboard.readText()
        const key = clipboardContents.slice(0, 16)
        setSecretKey(key)
    }

    function isDisabled(): boolean {
        if (vBalance === null) return true
        if (!parseFloat(amountToSend)) return true
        if (parseFloat(amountToSend) > vBalance) return true
        if (secretKey.length < 16) return true

        return false
    }

    function proceedWithDeposit() {
        if (isDisabled()) return
        const amountToDeposit = BigInt(parseFloat(amountToSend) * (10 ** DECIMALS))

        const { withdrawalKey, depositKey } = generateKeys(amountToDeposit, secretKey)
        setWithdrawalKey(withdrawalKey)

        let withdrawalKeys: string[], depositKeys: string[]
        
        if (splitDeposit) {
            let keys = breakDownKey(withdrawalKey, secretKey)
            withdrawalKeys = keys.withdrawalKeys
            depositKeys = keys.depositKeys
        } else {
            depositKeys = [depositKey]
            withdrawalKeys = [withdrawalKey]
        }

        setDepositKeys(depositKeys)
        setWithdrawalKeys(withdrawalKeys)

        setModal("DEPOSIT-PREVIEW")
    }

    return <div className="w-full p-2">
        <div className="p-2 bg-body">
            <div className="w-full flex justify-between items-center text-sm">
                <span className="flex items-center">
                    Split deposit
                </span>

                <span className="hover:opacity-80 cursor-pointer text-2xl" onClick={() => setSplitDeposit(!splitDeposit)}>
                    {
                        splitDeposit ?
                            <FaToggleOn className="text-btn-success" />
                            : <FaToggleOff className="text-white" />
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
            <div className="h-[20%] flex justify-between">
                <span>
                    You send
                </span>
                <span>
                    <span className="cursor-pointer hover:opacity-80 ml-2" onClick={() => setAmountToSend("1")}>[1]</span>
                    <span className="cursor-pointer hover:opacity-80 ml-2" onClick={() => setAmountToSend("10")}>[10]</span>
                    <span className="cursor-pointer hover:opacity-80 ml-2" onClick={() => setAmountToSend("100")}>[100]</span>
                    <span className="cursor-pointer hover:opacity-80 ml-2" onClick={() => setAmountToSend("1000")}>[1000]</span>
                    <span
                        className="cursor-pointer hover:opacity-80 ml-2"
                        onClick={() => { if (vBalance !== null) setAmountToSend(vBalance.toString()) }}
                    >[Use Max]</span>
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
                        <img src={V_TOKEN.image} alt="V" className="w-full h-full" />
                        <img src={
                            loadImage(getChainImage(chainId))
                        } alt="USDC" className="w-[20px] h-[20px] absolute right-1 bottom-1" />
                    </div>
                </div>
            </div>

            <div className="h-[20%] flex justify-between relative">
                <span>
                    ${formatToFourDecimals(parseFloat(amountToSend))}
                </span>
                <span>
                    {
                        (vBalance !== null) ?
                            <span className="cursor-pointer" onClick={toggleShowUSD}>
                                Balance <span>
                                    {!showUSD
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
                Secret key
            </div>

            <div className="h-[60%] flex">
                <input
                    type={hidden ? "password" : "text"}
                    className="w-full flex justify-start items-center text-3xl tracking-tight"
                    style={{ textTransform: "none" }}
                    value={secretKey}
                    onChange={inputSecretKey}
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-form-type="other"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
            </div>

            <div className="h-[20%]">
                <span className="cursor-pointer hover:opacity-80" onClick={autogenerateKey}>[Auto generate]</span>
                <span className="cursor-pointer hover:opacity-80 ml-2" onClick={pasteKey}>[Paste]</span>
                <span className="cursor-pointer hover:opacity-80 ml-2" onClick={toggleHide}>[{hidden ? "Show" : "Hide"}]</span>
                <span className="cursor-pointer hover:opacity-80 ml-2">[{secretKeyCount}/16]</span>
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
                        networkFee ? `$${formatToFourDecimals(networkFee)}` : <Loader width={40} />
                    }</span>
                </span>
            </div>
            <div className="w-full py-1 flex justify-between items-center text-xs">
                <span>Protocol fee</span>
                <span className="flex items-center">
                    <span><BsFillLightningChargeFill /></span>
                    <span className="ml-2">
                        ${
                            (Number(amountToSend))
                                ? formatNumber(parseFloat((parseFloat(amountToSend) / 100).toFixed(2)))
                                : "0.00"
                        }
                    </span>
                </span>
            </div>
        </div>
        <div className="mt-4">
            <button
                className="bg-btn-success py-4 w-full text-lg hover:bg-btn-success-hover cursor-pointer"
                onClick={proceedWithDeposit}
                style={isDisabled() ? { opacity: "50%", cursor: "not-allowed" } : {}}
            >
                {
                    !address ? "Connect wallet" : "Preview deposit"
                }

            </button>
        </div>
    </div>
}