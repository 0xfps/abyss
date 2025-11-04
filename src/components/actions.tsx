import { useState } from "react"
import { Swap } from "./swap"
import { Deposit } from "./deposit"
import { Withdraw } from "./withdraw"
import { Redeem } from "./redeem"

type ActionTypes = "SWAP" | "REDEEM" | "DEPOSIT" | "WITHDRAW"

export function Actions() {
    const [action, setAction] = useState<ActionTypes>("SWAP")

    function loadCustomStyle(type: ActionTypes) {
        const defaultStyle = "h-full py-4 flex justify-center items-center lg:py-7 col-span-1 cursor-pointer text-md lg:text-lg"
        if (action == type) {
            return `${defaultStyle} bg-modal-bg opacity-100`
        } else return `${defaultStyle} hover:bg-modal-bg-hover opacity-80`
    }

    return <div className="text-sm h-fit lg:h-full col-span-6 lg:col-span-4 md:flex md:justify-center">
        <div className="h-full md:w-[75%] lg:w-[53%]">
            <div className="w-full grid grid-cols-4">
                <div className={`${loadCustomStyle("SWAP")}`} onClick={() => setAction("SWAP")}>
                    Swap
                </div>
                <div className={`${loadCustomStyle("REDEEM")}`} onClick={() => setAction("REDEEM")}>
                    Redeem
                </div>
                <div className={`${loadCustomStyle("DEPOSIT")}`} onClick={() => setAction("DEPOSIT")}>
                    Deposit
                </div>
                <div className={`${loadCustomStyle("WITHDRAW")}`} onClick={() => setAction("WITHDRAW")}>
                    Withdraw
                </div>
            </div>
            <div className="p-3 h-fit bg-modal-bg">
                {action == "SWAP" && <Swap />}
                {action == "REDEEM" && <Redeem />}
                {action == "DEPOSIT" && <Deposit/>}
                {action == "WITHDRAW" && <Withdraw/>}
            </div>
        </div>
    </div>
}