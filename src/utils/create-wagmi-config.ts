import { type Config, createConfig, http } from "@wagmi/core";
import { baseAccount, gemini, injected, metaMask, porto, safe, walletConnect } from "@wagmi/connectors"
import { arbitrumSepolia, avalancheFuji, baseSepolia, bscTestnet, optimismSepolia, sepolia } from "wagmi/chains"
import abyssConfig from "@fifteenfigures/abyss-config";

export default function createWagmiConfig(projectId: string | undefined, rpc: string | undefined): Config {
    if (!projectId) throw new Error("No Project Id Set!")
    if (!rpc) throw new Error("No RPC Defined!")

    const config = createConfig({
        chains: abyssConfig.testnetConfig.chains as any,
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
            // Create a new Alchemy Account to use new Alchemy RPCs.
            // [arbitrumSepolia.id]: http(`https://arb-sepolia.g.alchemy.com/v2/${rpc}`),
            // [avalancheFuji.id]: http(`https://avax-fuji.g.alchemy.com/v2/${rpc}`),
            // [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${rpc}`),
            // [bscTestnet.id]: http(`https://bnb-testnet.g.alchemy.com/v2/${rpc}`),
            // [optimismSepolia.id]: http(`https://opt-sepolia.g.alchemy.com/v2/${rpc}`),
            // [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${rpc}`)
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