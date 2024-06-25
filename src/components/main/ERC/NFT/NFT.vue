<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import AddDialog from '@/components/main/ERC/NFT/add/AddDialog.vue'
  import AddBtn from '@/components/main/ERC/NFT/add/AddBtn.vue'
  import NFTCard from '@/components/main/ERC/NFT/NFTCard.vue'
  import { getNFTsForOwner } from '@/getNFTsForOwner'

  const dialogVisible = ref(false)
  const NFTsList = ref()
  let importedNFTs = window.localStorage.getItem('ImportedNFTs')
  onMounted(async () => {
    NFTsList.value = await getNFTsForOwner("0x79b505CAE4d1Ec0178EE7F375A1053971032E159", "eth-mainnet");
    if (importedNFTs) {
      importedNFTs = JSON.parse(importedNFTs)
    }
  })
</script>

<template>
  <div id="container">
   <div v-for="NFT in NFTsList" :key="NFT.id">
     <NFTCard v-if="NFT.tokenType === 'ERC721' && NFT.name" :metadata="NFT"/>
   </div>
    <div v-for="NFT in importedNFTs" :key="NFT.id">
      <NFTCard v-if="NFT.tokenType === 'ERC721' && NFT.name" :metadata="NFT"/>
    </div>
    <AddBtn :label="'NFT'" @click="dialogVisible = true" id="add-btn"/>
  </div>
  <AddDialog v-if="dialogVisible" @close-dialog="dialogVisible = false"/>
</template>

<style scoped>
  #add-btn {
    display: flex;
    justify-content: center;
    position: sticky;
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