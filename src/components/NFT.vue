<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import AddDialog from '@/components/AddDialog.vue'
  import AddBtn from '@/components/AddBtn.vue'
  import NFTCard from '@/components/NFTCard.vue'
  import { getNFTsForOwner } from '@/getNFTsForOwner'

  const dialogVisible = ref(false)
  const NFTsList = ref()
  onMounted(async () => {
    NFTsList.value = await getNFTsForOwner("0x79b505CAE4d1Ec0178EE7F375A1053971032E159", "eth-mainnet");
  })
</script>

<template>
  <div id="container">
   <div v-for="NFT in NFTsList" :key="NFT.id">
     <NFTCard v-if="NFT.tokenType === 'ERC721' && NFT.name" :metadata="NFT"/>
   </div>
    <AddBtn :label="'NFT'" @click="dialogVisible = true" id="add-btn"/>
  </div>
  <AddDialog v-if="dialogVisible" :visible="dialogVisible" @close-dialog="dialogVisible = false" @data-retrieved="handleDataRetrieved"/>
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