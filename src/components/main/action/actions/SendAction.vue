<script setup lang="ts">
import { sendTransaction } from '@/sendTransaction'
import { type Ref, ref } from 'vue'

const emit = defineEmits(['close-dialog'])
const address: Ref<string> = ref('')
const amount: Ref<number> = ref(0)

const send = async () => {
  if (address.value.startsWith('0x') && amount.value > 0) {
    console.log(await sendTransaction(address.value, BigInt(amount.value)))
    emit('close-dialog')
  }
}
</script>

<template>
  <input v-model="address" placeholder="address" />
  <input v-model="amount" placeholder="amount" />
  <button v-if="address.startsWith('0x') && amount > 0" @click="send()">Send</button>
  <button v-else @click="$emit('close-dialog')" id="cancelBtn">Cancel</button>
</template>

<style scoped>
#cancelBtn {
  background-color: #ba0000;
}
input {
  margin-inline: 10px;
  width: 100%;
  height: 3.9vh;
  padding: 10px;
  background-color: #000000;
}
button {
  width: 10vw;
  margin-inline: 10px;
  background-color: #1e6bde;
}

button:hover {
  cursor: pointer;
}

button:active {
  background-color: #1a5cbd;
}

input,
button {
  outline: none;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 15px;
}
</style>
