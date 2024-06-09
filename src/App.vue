<script setup lang="ts">
  import VerticalNavbar from "./components/VerticalNavbar.vue";
  import { createWalletClient, custom } from 'viem'
  import { wagmiContract } from './contract'
  import { client } from './client'
  import { sepolia } from 'viem/chains'
  import 'viem/window'
  import ERC from "./components/ERC.vue";
  import { ref } from "vue";

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum!)
  });

  const wallet = ref();

  const connect = async () => {
    wallet.value = await walletClient.requestAddresses();
  }
</script>

<template>
  <div id="container">
    <header>
      <button v-if="!wallet" @click="connect">Connect Wallet</button>
      <p v-else >{{ wallet[0] }}</p>
    </header>
    <main>
      <VerticalNavbar />
      <div id="info">
        <div />
        <ERC />
        <div id="transactions"></div>
        <div />
      </div>
    </main>
  </div>
</template>

<style scoped>
  #container {
    height: 100vh;
    background-color: rgb(3, 3, 3);
  }
  header {
    height:10vh;
    background-color: rgb(25, 25, 25);
    color: white;
    width: 100vw;
    border-bottom: 1px solid rgb(3, 3, 3);
  }
  main {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 90vh;
  }
  #info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  #transactions {
    width: 27.91vw;
    height: 80vh;
    background-color: rgb(25, 25, 25);
    border-radius: 20px;
  }
</style>
