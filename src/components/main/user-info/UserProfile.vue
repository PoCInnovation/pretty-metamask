<script setup lang="ts">
import Dots3Icon from '../../../assets/3DotsIcon.svg'
import TooltipCopy from './TooltipCopy.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const selectedAccount = computed(() => store.getters.selectedAccount)
const reducedAddress = computed(() => {
  return selectedAccount.value
    ? `${selectedAccount.value.slice(0, 7)}...${selectedAccount.value.slice(-5)}`
    : null
})
</script>

<template>
  <div id="container">
    <div>
      <h1 id="name">Main Account</h1>
      <div id="address" v-if="selectedAccount">
        <p>{{ reducedAddress }}</p>
        <TooltipCopy :address="selectedAccount" />
        <!-- Adresse complète passée pour la copie -->
      </div>
      <div v-else>
        <p>No account selected</p>
      </div>
    </div>
    <img :src="Dots3Icon" alt="icon" />
  </div>
  <div id="bottomLine" />
</template>

<style scoped>
#container {
  padding-inline: 42px;
  padding-block: 32px;
  display: flex;
  height: 11vh;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
#name {
  color: white;
}
#address {
  display: flex;
  flex-direction: row;
}
h1 {
  font-size: 27px;
}
p {
  color: #808080;
  font-size: 13px;
  margin-right: 11px;
}
img {
  height: 18px;
  width: 18px;
}
img:hover {
  cursor: pointer;
}
#bottomLine {
  width: 100%;
  height: 1px;
  background-color: #4e4e4e;
}
</style>
