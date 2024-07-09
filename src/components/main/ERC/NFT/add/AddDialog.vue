<script setup lang="ts">
  import { ref } from 'vue'
  import { getNFTMetadata } from '@/getNFTMetadata'
  import { addImportedNFTs} from '@/updateWallet'
  import PopUpNFT from '@/components/main/ERC/NFT/PopUpNFT.vue'

  const emit = defineEmits(['close-dialog'])
  const smartContract = ref('0x0af85e2dee602b0a14d50f4fc1096c2f7fbe60f2')
  const tokenID = ref(102)
  const metadata = ref(null)
  const error = ref(false)
  const displayImported = ref(false)
  const addNFT = async () => {
    metadata.value = await getNFTMetadata(smartContract.value, tokenID.value, "eth-mainnet")
    error.value = addImportedNFTs(metadata.value)
    if (!error.value) {
      displayImported.value = true
    }
  }
  const closeDialog = () => {
    displayImported.value = false;
    emit('close-dialog')
  }
</script>

<template>
  <div id="transparent">
    <div id="dialog">
      <div :style="{marginBottom:'2vh'}">
        <label>Smart contract</label>
        <input v-model="smartContract"/>
      </div>
      <div :style="{marginBottom:'2vh', display:'flex', flexDirection:'column'}">
        <label>Token Id</label>
        <input v-model="tokenID" :style="{width:'50%'}"/>
      </div>
      <div id="btn">
        <button @click="addNFT">Import</button>
        <button @click="emit('close-dialog')">Cancel</button>
      </div>
      <p v-if="error">This NFT is already imported.</p>
      <Transition>
        <PopUpNFT v-if="displayImported" :metadata="metadata" @close-popUp="closeDialog"/>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.2s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
  button {
    padding: 10px;
    border-radius: 5px;
    outline: none;
    border: none;
    font-weight: bold;
    font-size: 0.9rem;
    background: #1E6BDE;
    color: white;
    cursor: pointer;
  }
  button:hover {
    background-color: #1E6BDE;
  }
  #btn {
    display: flex;
    justify-content: space-between;
  }
  label {
    color: white;
    font-size: 2rem;
    font-weight: bold;
  }
  input {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    outline: none;
    border: 1px solid #535353;
    background: none;
    color: white;
  }
  #transparent {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
  #dialog {
    width: 30vw;
    background-color: rgb(25, 25, 25);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    padding: 30px;
  }
</style>