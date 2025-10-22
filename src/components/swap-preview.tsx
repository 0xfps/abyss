import { loadImage } from "@/utils/load-image";
import { ModalBg } from "./modal-bg";
import { ModalHeader } from "./modal-header";
import { getChainImage } from "@/utils/get-chain-image";
import attpConfig from "@fifteenfigures/attp-config";
import { FaCheck, FaGasPump } from "react-icons/fa6";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { truncateAddress } from "@/utils/truncate-address";
import { ZeroAddress } from "ethers";
import { IoNewspaperOutline } from "react-icons/io5";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { CgSpinnerAlt } from "react-icons/cg";

export function SwapPreview() {
    return <ModalBg>
        <div className="w-full p-2">
            <ModalHeader title="Swap preview" />

            <div className="p-2 bg-body h-[120px] mt-4">
                <div className="h-[20%] flex justify-between">
                    <span>
                        You send
                    </span>
                </div>

                <div className="h-[60%] flex">
                    <div className="w-[80%] flex justify-start items-center font-klartext-bold text-5xl tracking-tight">
                        25,610.12
                    </div>
                    <div className="w-[20%] flex justify-end items-center">
                        <div className="relative h-full aspect-square p-2">
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
                        25,610.12
                    </div>
                    <div className="w-[20%] flex justify-end items-center">
                        <div className="relative h-full aspect-square p-2">
                            <img src={loadImage(attpConfig.USDC_IMG)} alt="USDC" className="w-full h-full" />
                            <img src={
                                loadImage(getChainImage(421614))
                            } alt="USDC" className="w-[20px] h-[20px] absolute right-1 bottom-1" />
                        </div>
                    </div>
                </div>

                <div className="h-[20%]">
                    $25,609.87
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
                <div className="w-full py-1 flex justify-between items-center text-xs">
                    <span>Contract</span>
                    <span className="flex items-center">
                        <span><IoNewspaperOutline /></span>
                        <a href="#" target="_blank" className="flex items-center hover:underline">
                            <span className="ml-2">{truncateAddress(ZeroAddress, 5)}</span>
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
                <div className="w-full py-1 flex justify-between items-center text-xs">
                    <span>Approving</span>
                    <span className="flex items-center text-btn-success">
                        <span className="spinner"><CgSpinnerAlt /></span>
                        {/* <FaCheck /> */}
                    </span>
                </div>
                <div className="w-full py-1 flex justify-between items-center text-xs">
                    <span>Swapping</span>
                    <span className="flex items-center text-btn-success">
                        <span className="spinner"><CgSpinnerAlt /></span>
                        {/* <FaCheck /> */}
                    </span>
                </div>
            </div>
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
            <div className="mt-4">
                <button className="bg-btn-success py-4 w-full text-lg hover:bg-btn-success-hover cursor-pointer">
                    Approve and swap
                </button>
            </div>
        </div>
    </ModalBg>
}