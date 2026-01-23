"use client"

import { loadImage } from "@/utils/load-image";
import abyssConfig from "@fifteenfigures/abyss-config";
import { FaGasPump } from "react-icons/fa6";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { getChainImage } from "@/utils/get-chain-image";
import { useModalStore } from "@/store/modal-store";
import { TokenAndAmountContext } from "@/providers/token-and-amount-provider";
import { ChainIdContext } from "@/providers/chain-id-provider";
import { useAccount, useConfig } from "wagmi";
import { DepositWithdrawContext } from "@/providers/deposit-withdrawal-provider";
import { useNetworkFee } from "@/hooks/use-network-fee";
import { readContract } from "@wagmi/core"
import { DECIMALS, V_TOKEN } from "@/utils/constants";
import { getMaxWithdrawalOnKey } from "@fifteenfigures/tiny-merkle-tree";
import { Loader } from "./loader";
import { formatToFourDecimals } from "@/utils/to-four-decimals";
import { LeavesContext } from "@/providers/leaves-provider";
import { useFetchLeafCount } from "@/hooks/use-fetch-leaf-count";
import { PollChainIdContext } from "@/providers/poll-chain-id-provider";
import { getTokenBalanceFor } from "@/utils/get-token-balance-for";
import { RiMoneyDollarCircleFill } from "react-icons/ri";

export function Withdraw() {
    const { address } = useAccount()
    const config = useConfig()
    const [showUSD, setShowUSD] = useState<boolean>(false)
    const { setModal, setPrevModal } = useModalStore()
    const { chainId } = useContext(ChainIdContext)
    const [secretKeyCount, setSecretKeyCount] = useState<number>(0)
    const [withdrawalKeyCount, setWithdrawalKeyCount] = useState<number>(0)
    const [keyBalance, setKeyBalance] = useState<number | null>(null)
    const { leaves } = useContext(LeavesContext)
    const leafCount = useFetchLeafCount()
    const { removePollChainId, setPollChainId } = useContext(PollChainIdContext)

    const [vTokenAddress, setVTokenAddress] = useState<string>("")
    const [contractAddress, setContractAddress] = useState<string>("")
    const [liquidity, setLiquidity] = useState<number | null>(null)

    const { abyssAbi } = abyssConfig
    const {
        amountToSend,
        setAmountToSend
    } = useContext(TokenAndAmountContext)

    const {
        withdrawalKey,
        secretKey,
        hidden,
        trigger,
        setHidden,
        setSecretKey,
        setWithdrawalKey
    } = useContext(DepositWithdrawContext)

    useEffect(function () {
        removePollChainId()
        setPollChainId(chainId)
    }, [])

    useEffect(function () {
        const { swapperAddress, abyssAddress } = abyssConfig.testnetConfig.chainsConfig[chainId]
        setVTokenAddress(swapperAddress)
        setContractAddress(abyssAddress)
    }, [chainId])

    // Don't remove this here.
    const networkFee = useNetworkFee("WITHDRAW")

    useEffect(function () {
        setLiquidity(null)

        if (contractAddress) {
            loadLiquidity()
        } else setLiquidity(0)
    }, [contractAddress, trigger])

    async function loadLiquidity() {
        const balance = await getTokenBalanceFor(contractAddress, config, {
            address: vTokenAddress,
            chainId,
            name: "V",
            symbol: "V",
            image: ""
        })
        setLiquidity(balance)
    }

    useEffect(function () {
        if (withdrawalKey.length == 130) {
            computeKeyBalance()
        } else {
            setKeyBalance(0)
        }
    }, [chainId, withdrawalKey, trigger])

    async function computeKeyBalance() {
        setKeyBalance(null)

        const mainContractAddress = abyssConfig.testnetConfig.chainsConfig[chainId].abyssAddress
        try {
            const keyWithdrawals = await readContract(config, {
                address: mainContractAddress as `0x${string}`,
                abi: abyssAbi,
                functionName: "withdrawals",
                args: [withdrawalKey],
                chainId
            })

            const keyWithdrawalsBase = Number(keyWithdrawals) / (10 ** DECIMALS)
            const keyMaxWithdrawal = Number(getMaxWithdrawalOnKey(withdrawalKey)) / (10 ** DECIMALS)
            setKeyBalance(keyMaxWithdrawal - keyWithdrawalsBase)
        } catch {
            setKeyBalance(0)
        }
    }

    useEffect(function () {
        setSecretKeyCount(secretKey.length)
    }, [secretKey])

    useEffect(function () {
        setWithdrawalKeyCount(withdrawalKey.length)
    }, [withdrawalKey])

    function toggleShowUSD() {
        setShowUSD(!showUSD)
    }

    function toggleHide() {
        setHidden(!hidden)
    }

    function inputAmountToWithdraw(e: ChangeEvent<HTMLInputElement>) {
        const { value } = e.target
        if (!isNaN(Number(value))) {
            setAmountToSend(value)
        }
    }

    function inputSecretKey(e: ChangeEvent<HTMLInputElement>) {
        const secret = e.target.value.slice(0, 16)
        setSecretKey(secret)
    }

    function inputWithdrawalKey(e: ChangeEvent<HTMLInputElement>) {
        const withdrawalKey = e.target.value.slice(0, 130)
        setWithdrawalKey(withdrawalKey)
    }

    async function pasteKey() {
        const clipboardContents = await navigator.clipboard.readText()
        const key = clipboardContents.slice(0, 16)
        setSecretKey(key)
    }

    async function pasteWithdrawalKey() {
        const clipboardContents = await navigator.clipboard.readText()
        const key = clipboardContents.slice(0, 130)
        setWithdrawalKey(key)
    }

    function isDisabled(): boolean {
        if (!amountToSend) return true
        if (!parseFloat(amountToSend)) return true
        if (parseFloat(amountToSend) > keyBalance!) return true
        if (secretKey.length < 16) return true
        if (leaves.length < leafCount) return true
        if (parseFloat(amountToSend) > liquidity!) return true

        return false
    }

    function proceedWithWithdrawal() {
        if (isDisabled()) return

        setModal("WITHDRAW-PREVIEW")
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
                    value={withdrawalKey}
                    onChange={inputWithdrawalKey}
                />
            </div>

            <div className="h-[20%]">
                <span className="cursor-pointer hover:opacity-80" onClick={pasteWithdrawalKey}>[Paste]</span>
                <span className="cursor-pointer hover:opacity-80 ml-2">[{withdrawalKeyCount}/130]</span>
            </div>
        </div>

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
                <span className="cursor-pointer hover:opacity-80" onClick={pasteKey}>[Paste]</span>
                <span className="cursor-pointer hover:opacity-80 ml-2" onClick={toggleHide}>[{hidden ? "Show" : "Hide"}]</span>
                <span className="cursor-pointer hover:opacity-80 ml-2">[{secretKeyCount}/16]</span>
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
                <span className="cursor-pointer hover:opacity-80" onClick={() => { if (keyBalance !== null) setAmountToSend(keyBalance.toString()) }}>
                    [Use Max]
                </span>
            </div>

            <div className="h-[60%] flex">
                <input
                    type="text"
                    className="w-[80%] flex justify-start items-center font-klartext-bold text-5xl tracking-tight"
                    value={amountToSend}
                    onChange={inputAmountToWithdraw}
                />
                <div className="w-[20%] flex justify-end items-center">
                    <div className="relative h-full aspect-square p-2 hover:opacity-80 cursor-pointer" onClick={() => {
                        setPrevModal("")
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
                        (keyBalance !== null) ?
                            <span className="cursor-pointer" onClick={toggleShowUSD}>
                                Key Holdings <span>
                                    {!showUSD
                                        ? `${formatToFourDecimals(keyBalance)}`
                                        : `$${formatToFourDecimals(keyBalance)}`
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
                    <span className="ml-2">$0.00</span>
                </span>
            </div>
            <div className="w-full py-1 flex justify-between items-center text-xs">
                <span>Liquidity [$ABYSS]</span>
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
                onClick={proceedWithWithdrawal}
                style={isDisabled() ? { opacity: "50%", cursor: "not-allowed" } : {}}
            >
                {
                    !address
                        ? "Connect wallet"
                        : (leaves.length < leafCount)
                            ? "Polling leaves"
                            : "Preview withdrawal"
                }
            </button>
        </div>
    </div>
}