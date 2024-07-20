<script setup lang="ts">
import VerticalNavbar from '@/components/main/VerticalNavbar.vue'
</script>

<template>
  <div id="container">
    <header>
    </header>
    <main>
      <VerticalNavbar />
      <div id="info">
        <div id="ERC" >Please connect your wallet</div>
        <div id="transactions" />
      </div>
    </main>
  </div>
</template>

<style scoped>
#ERC {
  width: 45.347vw;
  height: 80vh;
  background-color: rgb(25, 25, 25);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: black;
}
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
  justify-content: space-evenly;
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