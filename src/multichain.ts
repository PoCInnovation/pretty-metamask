import { switchChain } from 'viem/actions'
import { sepolia, mainnet } from 'viem/chains'
import { pubClient } from './main'
import { ref } from 'vue'
import { x } from './main'

const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY

const chainLs = [
    {
        name: "sepolia",
        chain: sepolia,
        alchemyURL: `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`,
    },
    {
        name: "ethereum",
        chain: mainnet,
        alchemyURL: `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`,
    },
]

const chain = ref(chainLs[0])

const SwitchChain = (chainIdx: number) => {
    if (chainIdx >= chainLs.length) {
        console.log("Invalid chain index")
        return
    }
    chain.value = chainLs[chainIdx]
    pubClient.chain = chainLs[chainIdx].chain as typeof pubClient.chain
    x.defaults.baseURL = chainLs[chainIdx].alchemyURL
}

export { SwitchChain, chain, chainLs }