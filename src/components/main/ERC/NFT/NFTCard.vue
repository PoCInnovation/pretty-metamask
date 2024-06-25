<script setup lang="ts">
  import popUpNFT from '@/components/main/ERC/NFT/PopUpNFT.vue'
  import { ref } from 'vue'

  const props = defineProps(['metadata'])
  const popUp = ref(false)
  const imgSrc = ref(props.metadata.image.originalUrl)
  const truncate = (str: string, n: number) => str.length > n ? str.slice(0, n - 1) + '...' : str;
</script>

<template>
  <div id="card">
    <img v-if="!metadata.contentType || metadata.contentType.substring(0, 5) === 'image'" :src="imgSrc" @error="imgSrc = '/src/assets/default.png'" alt="image" @click="popUp = true">
    <video v-else id="video" loop autoplay muted @click="popUp = true">
      <source :src="metadata.image.orginialUrl"/>
    </video>
    <div>
      <p id="title">{{ metadata.name }}</p>
      <p id="desc" v-if="metadata.description">{{ truncate(metadata.description, 100) }}</p>
    </div>
  </div>
  <Transition>
    <popUpNFT v-if="popUp" :metadata="metadata" @close-popUp="popUp = false"/>
  </Transition>
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
  #video {
    width: 80px;
    height: 100%;
    object-fit: cover;
    margin-right: 26px;
    border-radius: 20px;
  }
  #card {
    display:flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 2vh;
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
</style>