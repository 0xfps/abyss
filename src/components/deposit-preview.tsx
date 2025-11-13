import { loadImage } from "@/utils/load-image";
import { ModalBg } from "./modal-bg";
import { ModalHeader } from "./modal-header";
import { getChainImage } from "@/utils/get-chain-image";
import abyssConfig from "@fifteenfigures/abyss-config";
import { FaCheck, FaCircleCheck, FaCopy, FaLeaf } from "react-icons/fa6";
import { truncateAddress } from "@/utils/truncate-address";
import { IoNewspaperOutline } from "react-icons/io5";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { CgSpinnerAlt } from "react-icons/cg";
import { useAccount, useConfig } from "wagmi";
import { useContext, useEffect, useState } from "react";
import { TokenAndAmountContext } from "@/providers/token-and-amount-provider";
import { DepositWithdrawContext } from "@/providers/deposit-withdrawal-provider";
import { ChainIdContext } from "@/providers/chain-id-provider";
import { switchChain, waitForTransactionReceipt, writeContract } from "@wagmi/core"
import { erc20Abi } from "viem";
import { extractKeyMetadata, getLeafFromKey } from "@fifteenfigures/tiny-merkle-tree";
import { formatNumber } from "@/utils/format-number";
import { V_TOKEN } from "@/utils/constants";
import { parseExplorerLinkForAddress, parseExplorerLinkFromHash } from "@/utils/parse-explorer-link-from-hash";
import { TbTransactionDollar } from "react-icons/tb";
import { getChainFromId } from "@/utils/get-chain-from-id";
import { getChainName } from "@/utils/get-chain-name";
import { MdKey } from "react-icons/md";
import { toaster } from "./toaster";
import { BiSolidErrorCircle } from "react-icons/bi";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { formatToFourDecimals } from "@/utils/to-four-decimals";

export function DepositPreview() {
    const { address, chainId } = useAccount()
    const config = useConfig()
    const { chainId: depositChainId } = useContext(ChainIdContext)

    const {
        amountToSend
    } = useContext(TokenAndAmountContext)

    const {
        secretKey,
        pullTrigger,
        withdrawalKey,
        depositKeys,
        withdrawalKeys,
        setWithdrawalKey
    } = useContext(DepositWithdrawContext)

    const [vTokenAddress, setVTokenAddress] = useState<string>("")
    const [leaves, setLeaves] = useState<string[]>([])

    const [contractAddress, setContractAddress] = useState<string>("")

    const [approving, setApproving] = useState<boolean>(false)
    const [approvalHash, setApprovalHash] = useState<string>("")

    const [depositing, setDepositing] = useState<boolean>(false)
    const [depositHash, setDepositHash] = useState<string>("")

    const [copiedLeaves, setCopiedLeaves] = useState<boolean>(false)
    const [i, setI] = useState<NodeJS.Timeout | null>(null)

    const { abyssAbi } = abyssConfig

    useEffect(function () {
        const { abyssAddress, swapperAddress } = abyssConfig.testnetConfig.chainsConfig[depositChainId]
        setContractAddress(abyssAddress)
        setVTokenAddress(swapperAddress)
        getDepositKeysAndLeaf()
    }, [])

    useEffect(function () {
        if (i) {
            return function () {
                clearInterval(i)
            }
        }
    }, [i])

    function getDepositKeysAndLeaf() {
        const leaves = depositKeys.map(function (depositKey: string) {
            return getLeafFromKey(depositKey)
        })

        setLeaves(leaves)
    }

    function isDisabled() {
        if (!address) return true
        if (!depositKeys.length) return true
        if (!leaves.length) return true
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
                    toaster({
                        title: "Approval successful",
                        description: `You successfully approved ${formatNumber(parseFloat(amountToSend))} $V.`,
                        icon: <BiSolidErrorCircle />
                    })

                    setApprovalHash(hash)
                    await deposit()
                }
            }
        } catch {
            toaster({
                title: "Approval failed or rejected",
                description: "Your transaction was not approved because you declined the approval request.",
                icon: <BiSolidErrorCircle />
            })

            setApproving(false)
        } finally { }
    }

    async function deposit() {
        setDepositing(true)

        try {
            const hash = await writeContract(config, {
                address: contractAddress as `0x${string}`,
                abi: abyssAbi,
                functionName: "deposit",
                args: [depositKeys],
                chainId: depositChainId
            })

            if (hash) {
                const waiting = await waitForTransactionReceipt(config, { hash })
                if (waiting) {
                    toaster({
                        title: "Deposit successful",
                        description: `
                        You successfully deposited ${formatNumber(parseFloat(amountToSend))} $V.
                        Your prompt to download your withdrawals keys would be sent shortly.
                        If not, click on the button below to download them.
                        `,
                        icon: <FaCircleCheck />,
                        action: promptDownload,
                        button: {
                            label: "Download withdrawal keys",
                            onClick: promptDownload
                        }
                    })

                    setDepositHash(hash)
                    pullTrigger()
                    promptDownload()
                    setWithdrawalKey("")
                }
            }
        } catch {
            toaster({
                title: "Deposit failed or rejected",
                description: "Your swap transaction failed because you declined the request.",
                icon: <BiSolidErrorCircle />
            })

            setApproving(false)
            setApprovalHash("")
            setDepositing(false)
        } finally { }
    }

    async function copyLeaves() {
        await navigator.clipboard.writeText(JSON.stringify({ leaves }))
        setCopiedLeaves(true)

        const i = setInterval(function () {
            setCopiedLeaves(false)
        }, 2_000)

        setI(i)
    }

    function promptDownload() {
        const date = new Date()
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()

        const dateInTimeString = date.toTimeString()
        const time = dateInTimeString.split(" ")[0]

        const dateString = `${day}-${month}-${year}`
        const timeString = `${dateString}-${time}`

        const fileName = `withdrawal-keys-${timeString}.txt`
        const fileContents = JSON.stringify({
            date: `${timeString} [UK Format]`,
            parentWithdrawalKey: `${withdrawalKey} This was used to generate the others. Don't use this.`,
            amountHeld: formatNumber(parseFloat(amountToSend)),
            withdrawalKeys,
            secretKey,
            leaves,
            chainId: depositChainId,
            chain: getChainName(getChainFromId(depositChainId, config))
        }, null, 2)

        const element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + fileContents)
        element.setAttribute("download", fileName)
        element.style.display = "none"

        element.click()
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
            <div className="mt-2">
                <div className="w-full py-1 flex justify-between items-center text-xs">
                    <span>Leaf</span>
                    <span className="flex items-center cursor-pointer hover:underline" onClick={copyLeaves}>
                        <span className="ml-2">{leaves.length && truncateAddress(leaves[0], 5)}
                            {
                                (leaves.length > 1) && `${leaves.length - 1}`
                            }
                        </span>
                        <span className="ml-1">{copiedLeaves ? <FaCheck /> : <FaCopy />}</span>
                    </span>
                </div>
                <div className="w-full py-1 flex justify-between items-center text-xs">
                    <span>Include leaf</span>
                    <span className="flex items-center">
                        <span><FaLeaf /></span>
                        <span className="ml-2 text-btn-success">Yes</span>
                    </span>
                </div>
                <div className="w-full py-1 flex justify-between items-center text-xs">
                    <span>Contract</span>
                    <span className="flex items-center">
                        <span><IoNewspaperOutline /></span>
                        <a href={parseExplorerLinkForAddress(contractAddress, depositChainId, config)} target="_blank" className="flex items-center hover:underline">
                            <span className="ml-2">{truncateAddress(contractAddress, 5)}</span>
                            <span><LuSquareArrowOutUpRight className="ml-1" /></span>
                        </a>
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
                            <span className="flex items-center cursor-pointer hover:opacity-80">
                                <span><MdKey /></span>
                                <span className="ml-1">
                                    {withdrawalKeys.length && truncateAddress(withdrawalKeys[0], 7)}
                                    {
                                        (withdrawalKeys.length > 1) && `${withdrawalKeys.length - 1}`
                                    }
                                </span>
                            </span>
                        </div>
                        <div className="w-full py-1 flex justify-between items-center text-xs">
                            <span>Secret key</span>
                            <span className="flex items-center cursor-pointer hover:opacity-80">
                                <span><MdKey /></span>
                                <span className="ml-1">{truncateAddress(secretKey, 4)}</span>
                            </span>
                        </div>
                        <div className="w-full py-1 flex justify-between items-center text-xs">
                            <span>Withdrawal Keys</span>
                            <span className="flex items-center cursor-pointer hover:opacity-80" onClick={promptDownload}>
                                <span>Download withdrawal keys [important]</span>
                                <span className="ml-1"><FaCloudDownloadAlt /></span>
                            </span>
                        </div>
                    </>
                }

                <div className="w-full py-1 flex justify-between items-center text-xs text-justify mt-4">
                    <span><HiOutlineInformationCircle /></span>
                    <span className="ml-1 text-xs tracking-normal">
                        After your deposit, you’ll be prompted to download your withdrawal keys — we don’t store or back them up.
                        Keep them secure, as they’re required for withdrawals. You can also download them directly from this modal.
                    </span>
                </div>
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