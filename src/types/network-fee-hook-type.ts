import { Config } from "wagmi"
import { ActionTypes } from "./action-type"

export type NetworkFeeHookType = {
    action: ActionTypes,
    contractAddress: string,
    config: Config,
    updateFeeData?: string[]
}