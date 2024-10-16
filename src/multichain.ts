import { sepolia, mainnet, arbitrum } from 'viem/chains'
import { ref } from 'vue'
import { x } from './main'
import { Network } from 'alchemy-sdk'

const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY

const chainLs = [
  {
    name: 'sepolia',
    chain: sepolia,
    alchemyURL: `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`,
    alchemyURLNFT: `https://eth-sepolia.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner/`,
    alchemyNetwork: Network.ETH_SEPOLIA
  },
  {
    name: 'ethereum',
    chain: mainnet,
    alchemyURL: `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`,
    alchemyURLNFT: `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner/`,
    alchemyNetwork: Network.ETH_MAINNET
  },
  {
    name: 'arbitrum',
    chain: arbitrum,
    alchemyURL: `https://arb-mainnet.g.alchemy.com/v2/${apiKey}`,
    alchemyURLNFT: `https://arb-mainnet.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner/`,
    alchemyNetwork: Network.ARB_MAINNET
  }
]

const chain = ref(chainLs[1])

const SwitchChain = (store: any, chainID?: number) => {
  if (chainID != undefined && chainID < chainLs.length) {
    localStorage.setItem('chainIdx', chainID.toString())
  }
  let chainIdx: number = parseInt(localStorage.getItem('chainIdx') || '-1')
  if (chainIdx < 0) {
    chainIdx = 0
    localStorage.setItem('chainIdx', '0')
  }
  if (chainIdx >= chainLs.length) {
    console.log('Invalid chain index')
    return
  }
  chain.value = chainLs[chainIdx]
  x.defaults.baseURL = chainLs[chainIdx].alchemyURL
  console.log('Switched to chain: ', chain.value)

  if (store) {
    store.dispatch('saveChain', { chain: chain.value })
    store.dispatch('switchWalletChain')
  } else {
    console.error('Vuex store is not initialized')
  }
}

export { SwitchChain, chain, chainLs }
