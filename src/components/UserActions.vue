<script setup lang="ts">
</script>

<template>
  <div id="container">
    <button>Buy</button>
    <button id="sellBTN">Sell</button>
    <button>Swap</button>
  </div>
</template>

<style scoped>
  button {
    width: 8.698vw;
    height: 39px;
    border-radius: 10px;
    border: none;
    background-color: #1E6BDE;
    color: white;
    font-size: 20px;
  }
  #container {
    height: 7.8vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #sellBTN {
    margin-inline: 21px;
  }
</style>