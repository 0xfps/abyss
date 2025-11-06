import { loadImage } from "@/utils/load-image";
import { ModalBg } from "./modal-bg";
import { ModalHeader } from "./modal-header";
import { getChainImage } from "@/utils/get-chain-image";
import attpConfig from "@fifteenfigures/attp-config";
import { FaCheck } from "react-icons/fa6";
import { truncateAddress } from "@/utils/truncate-address";
import { isAddress, ZeroAddress } from "ethers";
import { IoNewspaperOutline } from "react-icons/io5";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { CgSpinnerAlt } from "react-icons/cg";
import { useAccount, useConfig } from "wagmi";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { TokenAndAmountContext } from "@/providers/token-and-amount-provider";
import { useGetPriceData } from "@/hooks/use-get-price-data";
import { Loader } from "./loader";
import { V_TOKEN } from "@/utils/constants";
import { readContract, switchChain, waitForTransactionReceipt, writeContract } from "@wagmi/core"
import { getChainName } from "@/utils/get-chain-name";
import { getChainFromId } from "@/utils/get-chain-from-id";
import { erc20Abi } from "viem";
import { parseExplorerLinkFromHash } from "@/utils/parse-explorer-link-from-hash";
import { getDecimals } from "@/utils/get-decimals";
import { isETH } from "@/utils/is-eth";
import { TbTransactionDollar } from "react-icons/tb";
import { formatNumber } from "@/utils/format-number";
import { formatToTwoDecimals } from "@/utils/to-two-decimals";

export function RedeemPreview() {
    const { address, chainId } = useAccount()
    const config = useConfig()
    const {
        tokenToReceive,
        amountToSend,
        amountToReceive
    } = useContext(TokenAndAmountContext)
    const [destination, setDestinaton] = useState<string>("")
    const { updateFeeData } = useGetPriceData(tokenToReceive)
    const [ok, setOk] = useState<boolean>(false)

    const [contractAddress, setContractAddress] = useState<string>("")
    const [decimals, ] = useState<number>(6)
    const [updateFee, setUpdateFee] = useState<number>(20) // 20 wei as default unless changed.

    const [approving, setApproving] = useState<boolean>(false)
    const [approvalHash, setApprovalHash] = useState<string>("")

    const [swapping, setSwapping] = useState<boolean>(false)
    const [swapHash, setSwapHash] = useState<string>("")

    const { swapperAbi } = attpConfig

    useEffect(function () {
        const swapperAddress = attpConfig.testnetConfig.chainsConfig[tokenToReceive.chainId].swapperAddress
        setContractAddress(swapperAddress)
    }, [])

    useEffect(function () {
        if (contractAddress) getUpdateFee()
    }, [contractAddress])

    async function getUpdateFee() {
        const fee = await readContract(config, {
            address: contractAddress as `0x${string}`,
            abi: swapperAbi,
            functionName: "getOracleUpdateFee",
            args: [updateFeeData],
            chainId
        })

        setUpdateFee(Number(fee))
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
        return false
    }

    async function switchChainToId() {
        try {
            await switchChain(config, { chainId: tokenToReceive.chainId })
        } catch { } finally { }
    }

    async function processSwap() {
        if (isDisabled()) return
        if (approving) return

        if (chainId != tokenToReceive.chainId) {
            await switchChainToId()
        } else {
            await approve()
        }
    }

    async function approve() {
        setApproving(true)

        const amount = BigInt(parseFloat(amountToSend) * (10 ** decimals))
        try {
            const hash = await writeContract(config, {
                address: contractAddress as `0x${string}`,
                abi: erc20Abi,
                functionName: "approve",
                args: [contractAddress as `0x${string}`, amount],
                chainId: tokenToReceive.chainId
            })

            if (hash) {
                const waiting = await waitForTransactionReceipt(config, { hash })
                if (waiting) {
                    setApprovalHash(hash)
                    await swap()
                }
            }
        } catch {
            setApproving(false)
        } finally { }
    }

    async function swap() {
        setSwapping(true)

        const amount = BigInt(parseFloat(amountToSend) * (10 ** decimals))

        const params = {
            assetToSwapToOrFrom: tokenToReceive.address,
            amountToSwapToOrFrom: amount,
            receiver: destination,
            updateData: updateFeeData
        }

        const sweetSpot = BigInt(10)
        const value =
            isETH(tokenToReceive)
                ? amount + BigInt(updateFee) + sweetSpot
                : BigInt(updateFee) + sweetSpot

        try {
            const hash = await writeContract(config, {
                address: contractAddress as `0x${string}`,
                abi: swapperAbi,
                functionName: "swapFromPrivateToken",
                args: [params],
                value,
                chainId: tokenToReceive.chainId
            })

            if (hash) {
                const waiting = await waitForTransactionReceipt(config, { hash })
                if (waiting) {
                    setSwapHash(hash)
                }
            }
        } catch {
            setSwapping(false)
        } finally { }
    }

    return <ModalBg>
        <div className="w-full p-2">
            <ModalHeader title="Redeem preview" />

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
                                loadImage(getChainImage(tokenToReceive.chainId))
                            } alt="USDC" className="w-[20px] h-[20px] absolute right-1 bottom-1" />
                        </div>
                    </div>
                </div>

                <div className="h-[20%] flex justify-between relative">
                    <span>
                        ${formatToTwoDecimals(parseFloat(amountToSend))}
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
                    <div className="w-[80%] flex justify-start items-center font-klartext-bold text-5xl tracking-tight">
                        {formatNumber(amountToReceive)}
                    </div>
                    <div className="w-[20%] flex justify-end items-center">
                        <div className="relative h-full aspect-square p-2">
                            <img src={loadImage(tokenToReceive.image)} alt="USDC" className="w-full h-full" />
                            <img src={
                                loadImage(getChainImage(tokenToReceive.chainId))
                            } alt="USDC" className="w-[20px] h-[20px] absolute right-1 bottom-1" />
                        </div>
                    </div>
                </div>

                <div className="h-[20%]">
                    ${formatNumber(parseFloat(amountToSend))}
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
                            <span className="ml-1" onClick={() => setOk(false)}>[Change]</span>
                        </span>
                    </span>
                </div>
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}<div className="mt-2">
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
                                            href={parseExplorerLinkFromHash(approvalHash, tokenToReceive.chainId, config)}
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
                    swapping &&
                    <div className="w-full py-1 flex justify-between items-center text-xs">
                        <span>Swapping</span>
                        <span className="flex items-center text-btn-success">
                            <span>
                                {
                                    swapHash
                                        ? <a
                                            className="cursor-pointer hover:underline flex items-center"
                                            href={parseExplorerLinkFromHash(swapHash, tokenToReceive.chainId, config)}
                                            target="_blank"
                                        >
                                            <TbTransactionDollar className="text-white" />
                                            <span className="ml-1 text-white">{truncateAddress(swapHash, 8)}</span>
                                            <FaCheck className="ml-1" />
                                        </a>
                                        : <CgSpinnerAlt className="spinner" />
                                }
                            </span>
                        </span>
                    </div>
                }

                {
                    swapHash &&
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
                    onClick={processSwap}
                    style={(isDisabled() || approving || swapping) ? { opacity: "50%", cursor: "not-allowed" } : {}}
                >
                    {
                        !address
                            ? "Connect wallet"
                            : (chainId != tokenToReceive.chainId)
                                ? `Switch to ${getChainName(getChainFromId(tokenToReceive.chainId, config))}`
                                : "Approve and Redeem"
                    }
                </button>
            </div>
        </div>
    </ModalBg>
}