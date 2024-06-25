<script setup lang="ts">
import { getBalance } from '@/getBalance';
import { exchangeRates } from '@/exchangeRates'

const balance = await getBalance('0x79b505CAE4d1Ec0178EE7F375A1053971032E159').then((res: number) => Number(res) / Number(BigInt(1000000000000000000)))
const ETH = await exchangeRates('ETH').then((res: any) => res.data.rates.USD)
</script>

<template>
  <div id="container">
    <div id="token">
      <img src="../../../assets/eth_logo.png" alt="ETH" id="eth-logo"/>
      <div id="balance">
        <h1>{{ balance.toFixed(4) }} ETH</h1>
        <p>${{ (balance.toFixed(4) * ETH).toFixed(2) }} USD</p>
      </div>
    </div>
    <div id="exchange">
      <h2>1 ETH</h2>
      <img src="../../../assets/arrow.svg" alt="arrow" id="arrow"/>
      <h2>{{ ETH }} USD</h2>
    </div>
  </div>
</template>

<style scoped>
  #container {
    padding-block:30px;
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