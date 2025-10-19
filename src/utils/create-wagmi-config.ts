import { type Config, createConfig, http } from "@wagmi/core";
import { baseAccount, gemini, injected, metaMask, porto, safe, walletConnect } from "@wagmi/connectors"
import { arbitrumSepolia, avalancheFuji, baseSepolia, bscTestnet, optimismSepolia, sepolia } from "wagmi/chains"

export default function createWagmiConfig(projectId: string | undefined): Config {
    if (!projectId) throw new Error("No Project Id Set!")

    const config = createConfig({
        chains: [
            arbitrumSepolia,
            avalancheFuji,
            baseSepolia,
            bscTestnet,
            optimismSepolia,
            sepolia
        ],
        connectors: [
            baseAccount({
                appName: "Abyss",
                appLogoUrl: "https://i.ibb.co/xSQyNcWz/abyss.png" //https://ibb.co/d0ySR3Fk
            }),
            gemini(),
            injected(),
            metaMask(),
            porto(),
            safe({
                allowedDomains: [/^app\.safe\.global$/],
                debug: false,
            }),
            walletConnect({
                projectId
            })
        ],
        transports: {
            [arbitrumSepolia.id]: http(),
            [avalancheFuji.id]: http(),
            [baseSepolia.id]: http(),
            [bscTestnet.id]: http(),
            [optimismSepolia.id]: http(),
            [sepolia.id]: http()
        }
    })

    return config
}