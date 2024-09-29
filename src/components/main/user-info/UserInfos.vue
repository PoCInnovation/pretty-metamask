<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { getBalance } from '@/getBalance'
import { exchangeRates } from '@/exchangeRates'

const store = useStore()
const account = computed(() => store.getters.selectedAccount)
const balance = ref<number | null>(null)
const ETH = ref<number | null>(null)
const myChain = computed(() => store.getters.chain)

ETH.value = await exchangeRates('ETH').then((res: any) => res.data.rates.USD)
watchEffect(async () => {
  if (account.value) {
    balance.value = await getBalance(account.value).then(
      (res: number) => Number(res) / Number(BigInt(1000000000000000000))
    )
  }
})

watchEffect(async () => {
  if (myChain.value) {
    balance.value = await getBalance(account.value).then(
      (res: number) => Number(res) / Number(BigInt(1000000000000000000))
    )
  }
})
</script>

<template>
  <div id="container">
    <div id="token">
      <img src="/img/eth_logo.png" alt="ETH" id="eth-logo" />
      <div id="balance">
        <h1 v-if="balance !== null">{{ balance.toFixed(4) }} ETH</h1>
        <p v-if="balance !== null && ETH !== null">
          ${{ (balance.toFixed(4) * ETH).toFixed(2) }} USD
        </p>
      </div>
    </div>
    <div id="exchange">
      <h2>1 ETH</h2>
      <img src="../../../assets/arrow.svg" alt="arrow" id="arrow" />
      <h2 v-if="ETH !== null">{{ ETH }} USD</h2>
    </div>
  </div>
</template>

<style scoped>
#container {
  padding-block: 30px;
  padding-inline: 36px;
  height: 17.2vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#exchange {
  display: flex;
  flex-direction: row;
}
h1 {
  color: white;
  font-size: 30px;
}
h2 {
  color: white;
  font-size: 18px;
}
p {
  color: #808080;
  font-size: 18px;
}
#arrow {
  padding-inline: 20px;
}
#eth-logo {
  height: 57px;
  width: 57px;
  background-color: white;
  border-radius: 50px;
  margin-right: 26px;
}
#token {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
