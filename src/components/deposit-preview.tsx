import { loadImage } from "@/utils/load-image";
import { ModalBg } from "./modal-bg";
import { ModalHeader } from "./modal-header";
import { getChainImage } from "@/utils/get-chain-image";
import attpConfig from "@fifteenfigures/attp-config";
import { FaCheck, FaCopy, FaLeaf } from "react-icons/fa6";
import { truncateAddress } from "@/utils/truncate-address";
import { isAddress, ZeroAddress } from "ethers";
import { IoNewspaperOutline } from "react-icons/io5";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { CgSpinnerAlt } from "react-icons/cg";
import { useAccount, useConfig } from "wagmi";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { TokenAndAmountContext } from "@/providers/token-and-amount-provider";
import { DepositWithdrawContext } from "@/providers/deposit-withdrawal-provider";
import { ChainIdContext } from "@/providers/chain-id-provider";
import { switchChain, waitForTransactionReceipt, writeContract } from "@wagmi/core"
import { erc20Abi } from "viem";
import { extractKeyMetadata, generateDepositKey, getLeafFromKey } from "@fifteenfigures/tiny-merkle-tree";
import { formatNumber } from "@/utils/format-number";
import { V_TOKEN } from "@/utils/constants";
import { parseExplorerLinkFromHash } from "@/utils/parse-explorer-link-from-hash";
import { TbTransactionDollar } from "react-icons/tb";
import { getChainFromId } from "@/utils/get-chain-from-id";
import { getChainName } from "@/utils/get-chain-name";

export function DepositPreview() {
    const { address, chainId } = useAccount()
    const config = useConfig()
    const { chainId: depositChainId } = useContext(ChainIdContext)

    const {
        amountToSend
    } = useContext(TokenAndAmountContext)

    const {
        includeLeaf,
        secretKey,
        withdrawalKey,
    } = useContext(DepositWithdrawContext)

    const [vTokenAddress, setVTokenAddress] = useState<string>("")
    const [depositKey, setDepositKey] = useState<string>("")
    const [leaf, setLeaf] = useState<string>("")

    const [contractAddress, setContractAddress] = useState<string>("")
    const [ok, setOk] = useState<boolean>(false)

    const [destination, setDestinaton] = useState<string>("")
    const [approving, setApproving] = useState<boolean>(false)
    const [approvalHash, setApprovalHash] = useState<string>("")

    const [depositing, setDepositing] = useState<boolean>(false)
    const [depositHash, setDepositHash] = useState<string>("")

    const [copiedWKey, setCopiedWKey] = useState<boolean>(false)
    const [copiedSKey, setCopiedSKey] = useState<boolean>(false)
    const [copiedLeaf, setCopiedLeaf] = useState<boolean>(false)

    const { attpAbi } = attpConfig

    useEffect(function () {
        const { attpAddress, swapperAddress } = attpConfig.testnetConfig.chainsConfig[depositChainId]
        setContractAddress(attpAddress)
        setVTokenAddress(swapperAddress)
        getDepositKeyAndLeaf()
    }, [])

    useEffect(function () {
        if (!includeLeaf && address) {
            setDestinaton(address)
        } else setDestinaton(ZeroAddress)
    }, [address])

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
            await switchChain(config, { chainId: depositChainId })
        } catch { } finally { }
    }

    async function processDeposit() {
        if (isDisabled()) return
        if (approving) return

        if (!includeLeaf)
            setOk(true)

        if (chainId != depositChainId) {
            await switchChainToId()
        } else {
            await approve()
        }
    }

    async function approve() {
        setApproving(true)

        const { amount } = extractKeyMetadata(withdrawalKey)

        try {
            const hash = await writeContract(config, {
                address: vTokenAddress as `0x${string}`,
                abi: erc20Abi,
                functionName: "approve",
                args: [contractAddress as `0x${string}`, amount],
                chainId: depositChainId
            })

            if (hash) {
                const waiting = await waitForTransactionReceipt(config, { hash })
                if (waiting) {
                    setApprovalHash(hash)
                    await deposit()
                }
            }
        } catch {
            setApproving(false)
        } finally { }
    }

    async function deposit() {
        setDepositing(true)

        const params = [{
            depositKey,
            includeLeaf,
            recipient: destination
        }]

        try {
            const hash = await writeContract(config, {
                address: contractAddress as `0x${string}`,
                abi: attpAbi,
                functionName: "deposit",
                args: [params],
                chainId: depositChainId
            })

            if (hash) {
                const waiting = await waitForTransactionReceipt(config, { hash })
                if (waiting) {
                    setDepositHash(hash)
                }
            }
        } catch {
            setDepositing(false)
        } finally { }
    }

    async function copyWithdrawalKey() {
        await navigator.clipboard.writeText(JSON.stringify({
            withdrawalKey,
            secretKey,
            includeLeaf
        }))

        setCopiedWKey(true)
    }

    async function copySecretKey() {
        await navigator.clipboard.writeText(JSON.stringify({
            withdrawalKey,
            secretKey,
            includeLeaf
        }))

        setCopiedSKey(true)
    }

    async function copyLeaf() {
        await navigator.clipboard.writeText(leaf)
        setCopiedLeaf(true)
    }

    return <ModalBg>
        <div className="w-full p-2">
            <ModalHeader title="Deposit preview" />

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
                                loadImage(getChainImage(depositChainId))
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
                !includeLeaf &&
                <div className="p-2 bg-body h-[120px] mt-2">
                    <div className="h-[20%]">
                        You receive
                    </div>

                    <div className="h-[60%] flex">
                        <div className="w-[80%] flex justify-start items-center font-klartext-bold text-5xl tracking-tight">
                            {formatNumber(parseFloat(amountToSend))}
                        </div>
                        <div className="w-[20%] flex justify-end items-center">
                            <div className="relative h-full aspect-square p-2">
                                <img src={V_TOKEN.image} alt="USDC" className="w-full h-full" />
                                <img src={
                                    loadImage(getChainImage(depositChainId))
                                } alt="USDC" className="w-[20px] h-[20px] absolute right-1 bottom-1" />
                            </div>
                        </div>
                    </div>

                    <div className="h-[20%]">
                        ${formatNumber(parseFloat(amountToSend))}
                    </div>
                </div>
            }
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {
                (!includeLeaf && !ok) &&
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
                    <span>Leaf</span>
                    <span className="flex items-center cursor-pointer hover:underline" onClick={copyLeaf}>
                        <span className="ml-2">{truncateAddress(leaf, 5)}</span>
                        <span className="ml-1">{copiedLeaf ? <FaCheck /> : <FaCopy />}</span>
                    </span>
                </div>
                <div className="w-full py-1 flex justify-between items-center text-xs">
                    <span>Include leaf</span>
                    <span className="flex items-center">
                        <span><FaLeaf /></span>
                        <span className="ml-2 text-btn-success">{includeLeaf ? "Yes" : "No"}</span>
                    </span>
                </div>
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
                {
                    (!includeLeaf) &&
                    <div className="w-full py-1 flex justify-between items-center text-xs">
                        <span>Destination</span>
                        <span className="flex items-center">
                            <span><IoNewspaperOutline /></span>
                            <span className="flex items-center cursor-pointer hover:underline" onClick={() => setOk(false)}>
                                <span className="ml-2">{truncateAddress(destination, 5)}</span>
                                <span className="ml-1">[Change]</span>
                            </span>
                        </span>
                    </div>
                }
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="mt-2">
                {
                    approving &&
                    <div className="w-full py-1 flex justify-between items-center text-xs">
                        <span>Approving</span>
                        <span className="flex items-center text-btn-success">
                            <span >
                                {
                                    approvalHash
                                        ? <a
                                            className="cursor-pointer hover:underline flex items-center"
                                            href={parseExplorerLinkFromHash(approvalHash, depositChainId, config)}
                                            target="_blank"
                                        >
                                            <TbTransactionDollar className="text-white" />
                                            <span className="ml-1 text-white">{truncateAddress(approvalHash, 8)}</span>
                                            <FaCheck className="ml-1" />
                                        </a>
                                        : <CgSpinnerAlt className="spinner" />
                                }
                            </span>
                        </span>
                    </div>
                }

                {
                    depositing &&
                    <div className="w-full py-1 flex justify-between items-center text-xs">
                        <span>Depositing</span>
                        <span className="flex items-center text-btn-success">
                            <span>
                                {
                                    depositHash
                                        ? <a
                                            className="cursor-pointer hover:underline flex items-center"
                                            href={parseExplorerLinkFromHash(depositHash, depositChainId, config)}
                                            target="_blank"
                                        >
                                            <TbTransactionDollar className="text-white" />
                                            <span className="ml-1 text-white">{truncateAddress(depositHash, 8)}</span>
                                            <FaCheck className="ml-1" />
                                        </a>
                                        : <CgSpinnerAlt className="spinner" />
                                }
                            </span>
                        </span>
                    </div>
                }

                {
                    depositHash &&
                    <>
                        <div className="w-full py-1 flex justify-between items-center text-xs">
                            <span>Status</span>
                            <span className="flex items-center text-btn-success">
                                <span><FaCheck /></span>
                            </span>
                        </div>
                        <div className="w-full py-1 flex justify-between items-center text-xs">
                            <span>Withdrawal Key</span>
                            <span className="flex items-center cursor-pointer hover:opacity-80" onClick={copyWithdrawalKey}>
                                <span>{truncateAddress(withdrawalKey, 7)}</span>
                                <span className="ml-1">{copiedWKey ? <FaCheck /> : <FaCopy />}</span>
                            </span>
                        </div>
                        <div className="w-full py-1 flex justify-between items-center text-xs">
                            <span>Secret key</span>
                            <span className="flex items-center cursor-pointer hover:opacity-80" onClick={copySecretKey}>
                                <span>{truncateAddress(secretKey, 4)}</span>
                                <span className="ml-1">{copiedSKey ? <FaCheck /> : <FaCopy />}</span>
                            </span>
                        </div>
                    </>
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
                    onClick={processDeposit}
                    style={(isDisabled() || approving || depositing) ? { opacity: "50%", cursor: "not-allowed" } : {}}
                >
                    {
                        !address
                            ? "Connect wallet"
                            : (chainId != depositChainId)
                                ? `Switch to ${getChainName(getChainFromId(depositChainId, config))}`
                                : "Approve and deposit"
                    }
                </button>
            </div>
        </div>
    </ModalBg>
}