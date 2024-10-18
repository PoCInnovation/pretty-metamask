<script setup lang="ts">
import { type Ref, ref } from 'vue'
import BigNumber from 'bignumber.js';
import { useStore } from 'vuex'
import { computed } from 'vue'
import { x } from '../../../../main'
import { createWalletClient, http, getContract } from 'viem';
import { type Chain } from 'viem/chains';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json'
import { swap, getAssetInfos } from '../../../../lifi'
import { encodeFunctionData } from 'viem'

const emit = defineEmits(['close-dialog'])

// base values
const amount: Ref<number> = ref(0.0001)
const tokenfrom = ref('USDC')
const tokento = ref('ETH')
const errorMsg = ref('')

const store = useStore()

const getSelectedWallet = (wallets: any, address: string) => {
  for (const wallet of wallets) {
    if (wallet.address === address) {
      return wallet.wallet
    }
  }
}

const approveSwap = async (asset: `0x${string}`, spender: `0x${string}`, wallet: `0x${string}`, amount: string) => {
  const accounts = computed(() => store.getters.accounts)
  const account = store.getters.selectedAccount
  const walClient = getSelectedWallet(accounts.value, account)
  const chain = computed(() => store.getters.chain)
  const pubClient = store.getters.pubClient
  
  if (!account || !walClient) {
    throw new Error('Account or Wallet Client not available')
  }

  const wl = createWalletClient({
    chain: chain.value.chain.chain as Chain,
    transport: http(),
  })
  
  const data =  encodeFunctionData({
    abi: ERC20.abi,
    functionName: 'approve',
    args: [spender, amount]
  })
  console.log("approve data", data)
  const tx = await wl.prepareTransactionRequest({
    account: walClient.account.address,
    to: asset,
    value: BigInt(0),
    data: data,
  })
  const signature = await walClient.account.signTransaction(tx)
  console.log("signature", signature)
  var transactionInfos = (
      await x.post('/', {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_sendRawTransaction',
        params: [signature]
      })
    )
  if (transactionInfos.data.error) {
    errorMsg.value = transactionInfos.data.error.message
    return '0x0'
  }
  return transactionInfos.data.result
}

const sendSwapTx = async (tx: any): Promise<`0x${string}`> => {
  const accounts = computed(() => store.getters.accounts)
  const account = store.getters.selectedAccount
  const walClient = getSelectedWallet(accounts.value, account)
  const chain = computed(() => store.getters.chain)
  const pubClient = store.getters.pubClient
  
  if (!account || !walClient) {
    throw new Error('Account or Wallet Client not available')
  }

  const wl = createWalletClient({
    chain: chain.value.chain.chain as Chain,
    transport: http(),
  })
  
  const nonce = await pubClient.getTransactionCount({
    address: account,
  })
  console.log("nonce", nonce, account, pubClient)
  const tx2 = await wl.prepareTransactionRequest({
    account: walClient.account.address,
    to: tx.to,
    value: BigInt(0),
    data: tx.data,
    nonce: nonce + 1,
  })
  const signature = await walClient.account.signTransaction(tx2)
  console.log("signature", signature)
  var transactionInfos = (
      await x.post('/', {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_sendRawTransaction',
        params: [signature]
      })
    )
  console.log("swap result", transactionInfos)
  if (transactionInfos.data.error) {
    errorMsg.value = transactionInfos.data.error.message
    return '0x0'
  }
  return transactionInfos.data.result
}

const checkParams = () => {
  if (amount.value == 0) {
    errorMsg.value = 'Amount must be non-zero'
    return false
  }
  if (tokenfrom.value === tokento.value) {
    errorMsg.value = 'Token from and token to must be different'
    return false
  }
  if (tokenfrom.value == '' || tokento.value == '') {
    errorMsg.value = 'Token from and token to must be filled'
    return false
  }
  return true
}

const send = async () => {
  errorMsg.value = ''
  if (!checkParams()) {
    return
  }
  const chain = computed(() => store.getters.chain)
  const account = computed(() => store.getters.selectedAccount)
  const chainId = chain.value.chain.chain.id as number
  const assetInfos = await getAssetInfos(chainId.toString(), tokenfrom.value)
  console.log(assetInfos)
  const weiVal = new BigNumber(amount.value).multipliedBy(new BigNumber(10).pow(assetInfos.decimals))
  const res = await swap(chainId, tokenfrom.value, tokento.value, weiVal.toString(), account.value)
  if (res.message) {
    errorMsg.value = res.message
    return
  }
  console.log(res)

  if (tokenfrom.value !== 'ETH') {
    const resAp = await approveSwap(assetInfos.address, res.transactionRequest.to, account.value, weiVal.toString())
    if (resAp == '0x0') {
      return
    }
    // wait approval
  }
  const resSwap = await sendSwapTx(res.transactionRequest)
  if (resSwap == '0x0') {
    return
  }
  await new Promise(resolve => setTimeout(resolve, 500))
  emit('close-dialog')
  store.dispatch('refreshPage')
}
</script>

<template>
  <div class="back">
    <div class="box">
        <h1>Swap</h1>
        <input v-model="tokenfrom" placeholder="Token from (ETH, USDC, ...)" />
        <input v-model="tokento" placeholder="Token to  (ETH, USDC, ...)" />
        <input v-model="amount" placeholder="Amount" />
        <div class="btns">
          <button @click="$emit('close-dialog')" id="cancelBtn">Cancel</button>
          <button @click="send">Swap</button>
        </div>
        <h3 class="errorMs">{{ errorMsg }}</h3>
    </div>
  </div>
</template>

<style scoped>
.back {
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.errorMs {
  color: red;
  font-size: 15px;
  margin-top: 15px
}

.box {
    position: absolute;
    z-index: 100;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 50%;
    background-color: #333333;
    border-radius: 10px;
    padding: 10px;
}

h1 {
    color: white;
    font-size: 30px;
    margin-bottom: 5px;
}

.btns {
  margin-top: 15px;
}

#cancelBtn {
  background-color: #ba0000;
}
input {
  margin-inline: 10px;
  margin: 20px 0;
  width: 70%;
  height: 3.9vh;
  padding: 10px;
  background-color: #191919;
}
button {
  width: 10vw;
  margin-inline: 10px;
  background-color: #1e6bde;
}

button:hover {
  cursor: pointer;
}

button:active {
  background-color: #1a5cbd;
}

input,
button {
  outline: none;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 15px;
}
</style>
