import { sepolia, mainnet } from 'viem/chains'
import { pubClient } from './main'
import { ref } from 'vue'
import { x } from './main'
import { useStore } from 'vuex'
import { key } from './store'

const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY

const chainLs = [
    {
        name: "sepolia",
        chain: sepolia,
        alchemyURL: `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`,
        alchemyURLNFT: `https://eth-sepolia.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner/`,
    },
    {
        name: "ethereum",
        chain: mainnet,
        alchemyURL: `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`,
        alchemyURLNFT: `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner/`,
    },
]

const chain = ref(chainLs[0])

const SwitchChain = (chainID?: number) => {
    if (chainID != undefined && chainID < chainLs.length) {
        localStorage.setItem('chainIdx', chainID.toString())
    }
    var chainIdx: number = parseInt(localStorage.getItem('chainIdx') || '-1');
    if (chainIdx < 0) {
        chainIdx = 0
        localStorage.setItem('chainIdx', '0')
    }
    if (chainIdx >= chainLs.length) {
        console.log("Invalid chain index")
        return
    }
    chain.value = chainLs[chainIdx]
    pubClient.chain = chainLs[chainIdx].chain as typeof pubClient.chain
    x.defaults.baseURL = chainLs[chainIdx].alchemyURL
    const store = useStore(key)

    if (store) {
        store.dispatch('saveChain', { chain: chain.value })
        store.dispatch('switchWalletChain')
    } else {
        console.error('Vuex store is not initialized')
    }
}

export { SwitchChain, chain, chainLs }