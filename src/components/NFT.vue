<script lang="ts">
  import { defineComponent } from 'vue'
  import { getNFTsForOwner} from '@/getNFTsForOwner'

  export default defineComponent({
    name: 'NFT',
  })

  const NFTsList = await getNFTsForOwner("0x79b505CAE4d1Ec0178EE7F375A1053971032E159", "eth-mainnet")
  console.log(NFTsList)
</script>

<script setup lang="ts">
  import { ref } from 'vue'
  import AddDialog from '@/components/AddDialog.vue'
  import AddBtn from '@/components/AddBtn.vue'
  import NFTCard from '@/components/NFTCard.vue'

  const dialogVisible = ref(false)
</script>

<template>
  <div id="container">
   <div v-for="NFT in NFTsList" :key="NFT.id">
     <NFTCard v-if="NFT.tokenType === 'ERC721' && NFT.name" :name="NFT.name" :description="NFT.description" :content-type="NFT.image.contentType" :image="NFT.image.originalUrl"/>
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