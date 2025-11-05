import { Dispatch, SetStateAction } from "react"

export type SwapContextType = {
    usdToggle: boolean,
    price: number | null,
    updateFeeData: string[],
    setUsdToggle: Dispatch<SetStateAction<boolean>>
}