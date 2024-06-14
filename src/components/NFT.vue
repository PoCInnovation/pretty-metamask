<script lang="ts">
  import { defineComponent } from 'vue'
  import { getNFTsForOwner} from '@/getNFTsForOwner'

  export default defineComponent({
    name: 'NFT',
  })

  const NFTsList = await getNFTsForOwner("0x5dEccD005df66Cdd2F0b668610709e562eb3a00e", "eth-mainnet")
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
  </div>
  <AddBtn :label="'NFT'" @click="dialogVisible = true"/>
  <AddDialog v-if="dialogVisible" :visible="dialogVisible" @close-dialog="dialogVisible = false" @data-retrieved="handleDataRetrieved"/>
</template>

<style scoped>
  #container {
    margin-top: 3.9vh;
    margin-bottom: 2.63vh;
    margin-inline: 15px;
    height: 27vh;
    overflow: scroll;
    position: relative;
  }
  #container::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>