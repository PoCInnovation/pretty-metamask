<script setup lang="ts">
import { type Ref, ref } from 'vue'
import BigNumber from 'bignumber.js';
import { useStore } from 'vuex'
import { computed } from 'vue'
import { x } from '../../../../main'
import { createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';

const emit = defineEmits(['close-dialog'])
const address: Ref<string> = ref('')
const amount: Ref<number> = ref(0)

const store = useStore()

const getSelectedWallet = (wallets: any, address: string) => {
  for (const wallet of wallets) {
    if (wallet.address === address) {
      return wallet.wallet
    }
  }
}

const sendTransaction = async (to: `0x${string}`, value: BigNumber): Promise<`0x${string}`> => {
  const accounts = computed(() => store.getters.accounts)
  const account = store.getters.selectedAccount
  const walClient = getSelectedWallet(accounts.value, account)
  
  if (!account || !walClient) {
    throw new Error('Account or Wallet Client not available')
  }

  const wl = createWalletClient({
    chain: sepolia,
    transport: http(),
  })
  const weiVal = new BigNumber(value).multipliedBy(new BigNumber(10).pow(18))
  const tx = await wl.prepareTransactionRequest({
    account: walClient.account.address,
    to: to,
    value: BigInt(weiVal.toString()),
  })
  console.log("tx", tx)
  const signature = await walClient.account.signTransaction(tx)
  console.log("signature", signature)
  console.log(x.defaults.baseURL)
  var transactionInfos = (
      await x.post('/', {
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_sendRawTransaction',
        params: [signature]
      })
    )
  return transactionInfos.data.result
}

const send = async () => {
  if (address.value.startsWith('0x') && amount.value > 0) {
    const amountBigNumber = new BigNumber(amount.value);
    console.log(await sendTransaction(address.value as `0x${string}`, amountBigNumber))
    emit('close-dialog')
  }
}
</script>

<template>
  <input v-model="address" placeholder="address" />
  <input v-model="amount" placeholder="amount" />
  <button v-if="address.startsWith('0x') && amount > 0" @click="send()">Send</button>
  <button v-else @click="$emit('close-dialog')" id="cancelBtn">Cancel</button>
</template>

<style scoped>
#cancelBtn {
  background-color: #ba0000;
}
input {
  margin-inline: 10px;
  width: 100%;
  height: 3.9vh;
  padding: 10px;
  background-color: #000000;
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
