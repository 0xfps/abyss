import { ChainIdContext } from "@/providers/chain-id-provider";
import { DEFAULT_NETWORK_FEE } from "@/utils/constants";
import { useContext, useState } from "react";

export function useNetworkFee(): number {
    const { chainId } = useContext(ChainIdContext)
    const [networkFee, setNetworkFee] = useState<number>(DEFAULT_NETWORK_FEE)

    return networkFee
}