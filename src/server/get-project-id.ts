"use server"

import dotenv from "dotenv"

dotenv.config()

export async function getProjectId(): Promise<string> {
    const projectId = process.env.ABYSS_WALLET_CONNECT_PROJECT_ID
    if (!projectId) throw new Error("No Wallet Connect Project Id Set!")
    return projectId
}