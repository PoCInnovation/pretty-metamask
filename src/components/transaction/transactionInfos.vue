<template>
  <div class="bg">
    <main>
      <head>
        <h2>Transaction Infos</h2>
      </head>
      <div class="infos">
        <h4 v-if="call">Action: Call</h4>
        <h4 v-else>Action: Transaction</h4>
        <h4>Transaction hash: {{ props.data?.hash }}</h4>
        <h4>From: {{ fromAddr }}</h4>
        <h4>To: {{ toAddr }}</h4>
        <h4>Block number: {{ props.data?.blockNumber }}</h4>
        <h4>Time: {{ props.data?.date }}</h4>
        <h4>Value: {{ props.data?.value }} {{ props.data?.devise }}</h4>
      </div>
      <footer>
        <btn-transaction @click="$emit('close-popUp')" :txt="'Close'"></btn-transaction>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  open: Boolean,
  data: Object
})
const fromAddr = ref(props.data?.from)
const toAddr = ref(props.data?.to)
const call = ref(false)
if (props.data?.logs.receipt.logs.length > 0) {
  call.value = true
}

const isContract = async (address: `0x${string}`) => {
  const pubClient = useStore().getter.pubClient
  const contract = await pubClient.getBytecode({ address: address })
  return contract != undefined
}

const checkAddress = async (from: any, to: any) => {
  let tmp = await isContract(from)
  if (tmp) fromAddr.value += ' (Contract)'
  tmp = await isContract(to)
  if (tmp) toAddr.value = ' (Contract)'
}
checkAddress(fromAddr.value, toAddr.value)

console.log(props.data)
</script>

<style scoped>
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #191919;
  height: 70vh;
  width: 70vw;
  padding: 0 20px;
  border-radius: 20px;
}

head {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20%;
  padding-top: 20px;
  width: 100%;
}

head h2 {
  color: #fff;
  font-size: 34px;
  font-weight: bold;
  text-decoration: underline;
}

footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20%;
  width: 100%;
}

.infos {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  background-color: #191919;
  height: 60%;
  width: 100%;
  margin: 20px 0;
  padding: 0 20px;
  border-radius: 20px;
}

.infos h4 {
  color: #fff;
  font-size: 20px;
  margin-top: 10px;
}
</style>
