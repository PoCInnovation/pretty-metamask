<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NFT',
})

</script>

<script setup lang="ts">
  import { ref } from 'vue'
  import AddDialog from '@/components/AddDialog.vue'
  import AddBtn from '@/components/AddBtn.vue'

  const dialogVisible = ref(false)
  const tokenURI = ref()

  const handleDataRetrieved = (data: object) =>{
    tokenURI.value = data
    if (data)
      dialogVisible.value = false
  }
</script>

<template>
  <div id="container">
    <div v-if="tokenURI" id="card">
      <img :src="'https://ipfs.io/ipfs/' + tokenURI.image.replace('ipfs://', '')" alt="image">
      <div>
        <p id="title">{{ tokenURI.title }}</p>
        <p id="desc">{{ tokenURI.description }}</p>
      </div>
    </div>
    <AddBtn :label="'NFT'" @click="dialogVisible = true"/>
    <AddDialog v-if="dialogVisible" :visible="dialogVisible" @close-dialog="dialogVisible = false" @data-retrieved="handleDataRetrieved"/>
  </div>
</template>

<style scoped>
  #card {
    display:flex;
    flex-direction: row;
    align-items: center;
  }
  #title {
    color: white;
    font-size: 18px;
  }
  #desc {
    font-size: 16px;
    color: #A3A3A3;
  }
  img {
    width: 80px;
    height: 100%;
    border-radius: 20px;
    margin-right: 26px;
  }
  #container {
    margin-top: 3.9vh;
    margin-bottom: 2.63vh;
    margin-inline: 15px;
    height: 27vh;
  }
</style>