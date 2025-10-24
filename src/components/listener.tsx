import { truncateAddress } from "@/utils/truncate-address"
import { keccak256 } from "ethers"
import { LuSquareArrowOutUpRight } from "react-icons/lu"

export function Listener() {
    const address = keccak256("0x00").slice(0, 42)
    const amount = 500_000
    const leaf = keccak256("0x01")

    return <div className="lg:p-2 col-span-6 lg:col-span-2 hidden lg:block h-[600px]">
        <div className="p-2 bg-modal-bg h-full">
            <div className="flex justify-center items-center text-sm bg-body py-2 h-[10%]">
                New Deposits (Arbitrum sepolia)
            </div>
            <div className="p-1 bg-transparent h-[1%]"></div>
            <div className=" h-[89%] grid grid-rows-8 gap-0.5">
                <div className="row-span-1 grid grid-cols-3 bg-body text-sm">
                    <div className="col-span-1 flex justify-center items-center">
                        User
                    </div>
                    <div className="col-span-1 flex justify-center items-center">
                        Deposit
                    </div>
                    <div className="col-span-1 flex justify-center items-center">
                        Leaf
                    </div>
                </div>
                {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].slice(0, 7).map(function (_, i: number) {
                        return <div className="row-span-1 grid grid-cols-3 bg-body text-sm cursor-default" key={i}>
                            <div className="col-span-1 flex justify-center items-center">
                                {i + 1}. {truncateAddress(address, 4)}
                            </div>
                            <div className="col-span-1 flex justify-center items-center">
                                ${new Intl.NumberFormat().format(amount)}
                            </div>
                            <div className="col-span-1 flex justify-center items-center cursor-pointer hover:underline">
                                {truncateAddress(leaf, 4)} <span><LuSquareArrowOutUpRight className="ml-1" /></span>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    </div>
}