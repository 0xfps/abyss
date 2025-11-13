"use server"

import dotenv from "dotenv"

dotenv.config()

export async function getRPC(): Promise<string> {
    const rpc = process.env.ALCHEMY_RPC
    if (!rpc) throw new Error("No Wallet Connect Project Id Set!")
    return rpc
}