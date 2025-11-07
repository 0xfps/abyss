import { loadImage } from "@/utils/load-image";
import { ModalBg } from "./modal-bg";
import { ModalHeader } from "./modal-header";
import { getChainImage } from "@/utils/get-chain-image";
import attpConfig from "@fifteenfigures/attp-config";
import { FaCheck } from "react-icons/fa6";
import { truncateAddress } from "@/utils/truncate-address";
import { isAddress } from "ethers";
import { IoNewspaperOutline } from "react-icons/io5";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { CgSpinnerAlt } from "react-icons/cg";
import { useAccount, useConfig } from "wagmi";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { switchChain, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { TokenAndAmountContext } from "@/providers/token-and-amount-provider";
import { DepositWithdrawContext } from "@/providers/deposit-withdrawal-provider";
import { generateDepositKey, getLeafFromKey } from "@fifteenfigures/tiny-merkle-tree";
import { PollChainIdContext } from "@/providers/poll-chain-id-provider";
import { formatNumber } from "@/utils/format-number";
import { V_TOKEN } from "@/utils/constants";
import { parseExplorerLinkFromHash } from "@/utils/parse-explorer-link-from-hash";
import { TbTransactionDollar } from "react-icons/tb";
import { getChainName } from "@/utils/get-chain-name";
import { getChainFromId } from "@/utils/get-chain-from-id";

export function WithdrawPreview() {
    const { address, chainId } = useAccount()
    const config = useConfig()
    const { pollChainId } = useContext(PollChainIdContext)

    const {
        amountToSend
    } = useContext(TokenAndAmountContext)

    const {
        secretKey,
        pullTrigger,
        withdrawalKey,
    } = useContext(DepositWithdrawContext)

    const [depositKey, setDepositKey] = useState<string>("")
    const [leaf, setLeaf] = useState<string>("")

    const [contractAddress, setContractAddress] = useState<string>("")
    const [ok, setOk] = useState<boolean>(false)

    const [destination, setDestinaton] = useState<string>("")

    const [withdrawing, setWithdrawing] = useState<boolean>(false)
    const [withdrawHash, setWithdrawHash] = useState<string>("")

    const { attpAbi } = attpConfig

    useEffect(function () {
        const { attpAddress } = attpConfig.testnetConfig.chainsConfig[pollChainId]
        setContractAddress(attpAddress)
        getDepositKeyAndLeaf()
    }, [])

    function getDepositKeyAndLeaf() {
        const depositKey = generateDepositKey(withdrawalKey, secretKey)
        const leaf = getLeafFromKey(depositKey)
        setDepositKey(depositKey)
        setLeaf(leaf)
    }

    function inputDestnation(e: ChangeEvent<HTMLInputElement>) {
        setDestinaton(e.target.value)
    }

    async function pasteAddress() {
        const clipboardContent = await navigator.clipboard.readText()
        setDestinaton(clipboardContent)
    }

    function changeDestination() {
        if (isAddress(destination)) {
            setOk(true)
        }
    }

    function isDisabled() {
        if (!address) return true
        if (!isAddress(destination)) return true
        if (!depositKey) return true
        return false
    }

    async function switchChainToId() {
        try {
            await switchChain(config, { chainId: pollChainId })
        } catch { } finally { }
    }

    async function processWithdrawal() {
        if (isDisabled()) return
        if (withdrawing) return

        if (chainId != pollChainId) {
            await switchChainToId()
        } else {
            await withdraw()
        }
    }

    async function withdraw() {
        setWithdrawing(true)

        const params = [{}]

        try {
            const hash = await writeContract(config, {
                address: contractAddress as `0x${string}`,
                abi: attpAbi,
                functionName: "withdraw",
                args: [params],
                chainId: pollChainId
            })

            if (hash) {
                const waiting = await waitForTransactionReceipt(config, { hash })
                if (waiting) {
                    setWithdrawHash(hash)
                    pullTrigger()
                }
            }
        } catch {
            setWithdrawing(false)
        } finally { }
    }

    return <ModalBg>
        <div className="w-full p-2">
            <ModalHeader title="Withdraw preview" />

            <div className="p-2 bg-body h-[120px] mt-4">
                <div className="h-[20%] flex justify-between">
                    <span>
                        You send
                    </span>
                </div>

                <div className="h-[60%] flex">
                    <div className="w-[80%] flex justify-start items-center font-klartext-bold text-5xl tracking-tight">
                        {formatNumber(parseFloat(amountToSend))}
                    </div>
                    <div className="w-[20%] flex justify-end items-center">
                        <div className="relative h-full aspect-square p-2">
                            <img src={V_TOKEN.image} alt="USDC" className="w-full h-full" />
                            <img src={
                                loadImage(getChainImage(pollChainId))
                            } alt="USDC" className="w-[20px] h-[20px] absolute right-1 bottom-1" />
                        </div>
                    </div>
                </div>

                <div className="h-[20%] flex justify-between relative">
                    <span>
                        ${formatNumber(parseFloat(amountToSend))}
                    </span>
                </div>
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {
                !ok &&
                <div className="p-2 bg-body h-[120px] mt-2">
                    <div className="h-[20%]">
                        Destination
                    </div>

                    <div className="h-[60%] flex">
                        <input
                            type="text"
                            className="w-full flex justify-start items-center text-5xl tracking-tight"
                            value={destination}
                            onChange={inputDestnation}
                        />
                    </div>

                    <div className="h-[20%]">
                        <span className="cursor-pointer hover:opacity-80" onClick={pasteAddress}>[Paste]</span>
                        <span className="cursor-pointer hover:opacity-80 ml-2" onClick={changeDestination}>[OK]</span>
                    </div>
                </div>
            }
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="mt-2">
                <div className="w-full py-1 flex justify-between items-center text-xs">
                    <span>Contract</span>
                    <span className="flex items-center">
                        <span><IoNewspaperOutline /></span>
                        <a href="#" target="_blank" className="flex items-center hover:underline">
                            <span className="ml-2">{truncateAddress(contractAddress, 5)}</span>
                            <span><LuSquareArrowOutUpRight className="ml-1" /></span>
                        </a>
                    </span>
                </div>
                <div className="w-full py-1 flex justify-between items-center text-xs">
                    <span>Destination</span>
                    <span className="flex items-center">
                        <span><IoNewspaperOutline /></span>
                        <span className="flex items-center cursor-pointer hover:underline">
                            <span className="ml-2">{truncateAddress(destination, 5)}</span>
                            <span className="ml-1">[Change]</span>
                        </span>
                    </span>
                </div>
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="mt-2">
                {
                    withdrawing &&
                    <div className="w-full py-1 flex justify-between items-center text-xs">
                        <span>Withdrawing</span>
                        <span className="flex items-center text-btn-success">
                            <span>
                                {
                                    withdrawHash
                                        ? <a
                                            className="cursor-pointer hover:underline flex items-center"
                                            href={parseExplorerLinkFromHash(withdrawHash, pollChainId, config)}
                                            target="_blank"
                                        >
                                            <TbTransactionDollar className="text-white" />
                                            <span className="ml-1 text-white">{truncateAddress(withdrawHash, 8)}</span>
                                            <FaCheck className="ml-1" />
                                        </a>
                                        : <CgSpinnerAlt className="spinner" />
                                }
                            </span>
                        </span>
                    </div>
                }

                {
                    withdrawHash &&
                    <div className="w-full py-1 flex justify-between items-center text-xs">
                        <span>Status</span>
                        <span className="flex items-center text-btn-success">
                            <span><FaCheck /></span>
                        </span>
                    </div>
                }
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="mt-4">
                <button
                    className="bg-btn-success py-4 w-full text-lg hover:bg-btn-success-hover cursor-pointer"
                    onClick={processWithdrawal}
                    style={(isDisabled() || withdrawing) ? { opacity: "50%", cursor: "not-allowed" } : {}}
                >
                    {
                        !address
                            ? "Connect wallet"
                            : (chainId != pollChainId)
                                ? `Switch to ${getChainName(getChainFromId(pollChainId, config))}`
                                : "Withdraw"
                    }
                </button>
            </div>
        </div>
    </ModalBg>
}