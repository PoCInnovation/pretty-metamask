<script setup lang="ts">
  import VerticalNavbar from "./components/main/VerticalNavbar.vue";
  import transactions_container from "./components/transaction/transactions_container.vue";
  import ERC from "./components/main/ERC/ERC.vue";
  import Balance from './components/ButtonBalance.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <!-- <HelloWorld msg="You did it!" /> -->
       <Balance/>
    </div>
  </header>

  <main>
    <!-- <TheWelcome /> -->
  </main>
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
