import { loadImage } from "@/utils/load-image";
import attpConfig from "@fifteenfigures/attp-config";
import { FaGasPump } from "react-icons/fa6";
import { BsFillLightningChargeFill } from "react-icons/bs";

export function Swap() {
    return <div className="w-full p-2">
        <div className="p-2 bg-body h-[120px]">
            <div className="h-[20%] flex justify-between">
                <span>
                    You send
                </span>
                <span className="cursor-pointer hover:opacity-80">
                    [Use Max]
                </span>
            </div>

            <div className="h-[60%] flex">
                <input type="text" className="w-[80%] flex justify-start items-center font-klartext-bold text-5xl tracking-tight" value="25,610.12" />
                <div className="w-[20%] flex justify-end items-center">
                    <div className="relative h-full aspect-square p-2 hover:opacity-80 cursor-pointer">
                        <img src={loadImage(attpConfig.USDC_IMG)} alt="USDC" className="w-full h-full" />
                        <img src={
                            loadImage(attpConfig.testnetConfig.chainsConfig[421614].image as string)
                        } alt="USDC" className="w-[20px] h-[20px] absolute right-1 bottom-1" />
                    </div>
                </div>
            </div>

            <div className="h-[20%] flex justify-between relative">
                <span>
                    $25,609.87
                </span>
                <span className="tracking-normal">
                    Balance 25,610.12 ($25,609.87)
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
                <div className="w-[80%] flex justify-start items-center font-klartext-bold text-5xl tracking-tighter">
                    25,610.12
                </div>
                <div className="w-[20%] flex justify-end items-center">
                    <div className="relative h-full aspect-square p-2">
                        <img src={loadImage(attpConfig.USDC_IMG)} alt="USDC" className="w-full h-full" />
                        <img src={
                            loadImage(attpConfig.testnetConfig.chainsConfig[421614].image as string)
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
        </div>
        <div className="mt-4">
            <button className="bg-btn-success py-4 w-full text-lg hover:bg-btn-success-hover cursor-pointer">
                Preview swap
            </button>
        </div>
    </div>
}