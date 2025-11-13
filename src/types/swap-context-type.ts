import { Dispatch, SetStateAction } from "react"

export type SwapContextType = {
    usdToggle: boolean,
    setUsdToggle: Dispatch<SetStateAction<boolean>>
}