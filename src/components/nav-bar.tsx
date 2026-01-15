"use client"

import { useAccount } from "wagmi";
import { Address } from "./address";
import { ConnectWalletButton } from "./connect-wallet-button";
import { Icon } from "./icon";

export default function NavBar() {
    const { address } = useAccount()

    return <div className="p-2 md:p-5 h-[80px] flex items-center">
        <div className="h-full flex items-center w-[50%]">
            <a href="/">
                <Icon width={80} height={80} />
            </a>
            <span className="ml-3 md:ml-5">Abyss [Dev]</span>
        </div>
        <div className="flex items-center justify-end w-[50%] h-full">
            {address ? <Address address={address} /> : <ConnectWalletButton />}
        </div>
    </div>
}