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
    width: 100%;
    height: 3.9vh;
    border-radius: 10px;
    border: none;
    background-color: #1E6BDE;
    color: white;
    font-size: 20px;
    margin-inline: 10px;
  }
  button:hover {
    cursor: pointer;
  }
  #container {
    height: 7.8vh;
    display: flex;
    justify-content: center;
    padding-inline: 44px;
  }
</style>