<script setup lang="ts">
import transactions_container from './components/transactions_container.vue';
</script>

<template>
  <main class="main_app">
    <transactions_container />
  </main>
</template>

<style scoped>
.main_app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #030303;
}

.title {
  font-size: 24px;
  color: #333;
}
</style>
