<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import AddDialog from './add/AddDialog.vue'
import AddBtn from './add/AddBtn.vue'
import NFTCard from './NFTCard.vue'
import { getNFTsForOwner } from '../../../../getNFTsForOwner'
import { watchEffect } from 'vue'

const store = useStore()
const account = computed(() => store.getters.selectedAccount)
const chain = computed(() => store.getters.chain)

const dialogVisible = ref(false)
const NFTsList = ref([])
let importedNFTs = window.localStorage.getItem('ImportedNFTs')
const importedNftLs = ref([])

onMounted(async () => {
  if (account.value) {
    NFTsList.value = await getNFTsForOwner(account.value, chain.value.chain.alchemyURLNFT)
  }

  if (importedNFTs) {
    importedNftLs.value = await JSON.parse(importedNFTs)
  }
})

// watchEffect on dialogVisible and refresh the component
watchEffect(async () => {
  if (dialogVisible.value == false) {
    importedNFTs = window.localStorage.getItem('ImportedNFTs')
    if (importedNFTs) {
      importedNftLs.value = await JSON.parse(importedNFTs)
    }
  }
})
</script>

<template>
  <div id="container">
    <div v-for="NFT in NFTsList" :key="NFT.id">
      <NFTCard v-if="NFT.tokenType === 'ERC721' && NFT.name" :metadata="NFT" />
    </div>
    <div v-for="NFT in importedNftLs" :key="NFT.id">
      <NFTCard v-if="NFT.tokenType === 'ERC721'" :metadata="NFT" />
    </div>
    <AddBtn :label="'NFT'" @click="dialogVisible = true" id="add-btn" />
  </div>
  <AddDialog v-if="dialogVisible" @close-dialog="dialogVisible = false" />
</template>

<style scoped>
#add-btn {
  display: flex;
  justify-content: center;
  position: inherit;
  bottom: 1vh;
}
#container {
  margin-top: 3.9vh;
  margin-inline: 15px;
  height: 36vh;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
#container::-webkit-scrollbar {
  display: none;
}
</style>
