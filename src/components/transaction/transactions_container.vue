<template>
  <main class="transactions">
    <div class="title">Transactions</div>
    <div class="list">
      <transaction
        v-for="t in transactionshash"
        :hash="t.hash"
        :devise="t.devise"
        :from="t.from.valueOf()"
        :key="t.hash"
      />
      <h1
        v-if="transactionshash.length == 0"
        style="text-align: center; font-size: 30px; margin-top: 30%; color: #a1a1a1"
      >
        {{ msg }}
      </h1>
    </div>
    <div class="link">
      <div class="clickable">
        <h3 @click="walletLink()">View full history on etherscan</h3>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"
          />
        </svg>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import transaction from './transaction.vue'
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { fromHex } from 'viem'

interface Transaction {
  hash: string
  devise: string
  from: Boolean
  blockNb: number
}

const store = useStore()
const account = computed(() => store.getters.selectedAccount)
const transactionshash = ref<Transaction[]>([])
const msg = ref('No account')

watchEffect(async () => {
  if (account.value) {
    await btn()
  }
})

const walletLink = () => {
  if (account.value) {
    window.open(`https://sepolia.etherscan.io/address/${account.value}`)
  }
}

const getUniqueTransactions = (transactions: any): Transaction[] => {
  let trans: Transaction[] = []
  let unique = true
  for (const t of transactions) {
    unique = true
    for (const tr of trans) {
      if (t.hash == tr.hash) {
        unique = false
        break
      }
    }
    if (unique) trans.push(t)
  }
  return trans
}

const getLastTransactions = (transactions: Transaction[]): Transaction[] => {
  const sortedTransactions = transactions.sort((a, b) => b.blockNb - a.blockNb)
  const uniqueSortedTransactions = getUniqueTransactions(sortedTransactions)
  const last10Transactions = uniqueSortedTransactions.slice(0, 8)
  return last10Transactions
}

const btn = async () => {
  if (!account.value) return
  console.log('account: ', account.value)
  msg.value = 'Loading transactions...'

  let transactions = await getTransactionsFrom()
  let ls: Transaction[] = []

  for (const transaction of transactions) {
    ls.push({
      hash: transaction.hash,
      devise: transaction.asset,
      from: false,
      blockNb: fromHex(transaction.blockNum, 'number')
    })
  }

  transactions = await getTransactionsTo()
  for (const transaction of transactions) {
    ls.push({
      hash: transaction.hash,
      devise: transaction.asset,
      from: true,
      blockNb: fromHex(transaction.blockNum, 'number')
    })
  }

  transactionshash.value = getLastTransactions(ls)
  console.log('transactions: ', transactionshash.value)
  msg.value = 'No transactions found'
}

const getTransactionsFrom = async () => {
  if (!account.value) return []

  const data = JSON.stringify({
    jsonrpc: '2.0',
    id: 0,
    method: 'alchemy_getAssetTransfers',
    params: [
      {
        fromBlock: '0x0',
        toBlock: 'latest',
        toAddress: account.value,
        category: ['external', 'internal', 'erc20'],
        excludeZeroValue: false
      }
    ]
  })

  try {
    const transactions = (await store.getters.axiosInstance.post('/', data)).data.result.transfers
    return transactions
  } catch (error) {
    return []
  }
}

const getTransactionsTo = async () => {
  if (!account.value) return []

  const data = JSON.stringify({
    jsonrpc: '2.0',
    id: 0,
    method: 'alchemy_getAssetTransfers',
    params: [
      {
        fromBlock: '0x0',
        toBlock: 'latest',
        fromAddress: account.value,
        category: ['external', 'internal', 'erc20'],
        excludeZeroValue: false
      }
    ]
  })

  try {
    const transactions = (await store.getters.axiosInstance.post('/', data)).data.result.transfers
    return transactions
  } catch (error) {
    return []
  }
}

onMounted(async () => {
  await btn()
})
</script>

<style scoped>
main.transactions {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: transparent;
  height: 100%;
  width: 100%;
  padding: 0 20px;
}

.list {
  width: 100%;
  height: calc(100% - 120px);
}

.title {
  width: 100%;
  height: 70px;
  color: white;
  font-size: 30px;
  margin-bottom: 10px;
  margin-left: 25px;
  padding: 20px 0 20px 10px;
}

.link {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.clickable {
  cursor: pointer;
  width: max-content;
  height: max-content;
  display: flex;
  justify-content: center;
  align-items: center;
}

.link svg {
  fill: #1e6bde;
  height: 15px;
  width: 15px;
  margin-left: 10px;
}

.link h3 {
  color: #1e6bde;
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
