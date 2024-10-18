<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps(['visible', 'metadata'])
console.log(props.metadata)
const video = ref(false)
const banner = ref("/img/defaultBanner.png")
const slug = ref("no name")
if (props.metadata.collection) {
  banner.value = props.metadata.collection.bannerImageUrl
  slug.value = props.metadata.collection.slug
}
</script>

<template>
  <div id="background">
    <div id="pop-up" @click="$emit('close-popUp')">
      <img
        v-if="!video"
        :src="banner"
        alt="image"
        id="banner-img"
        @error="video = true"
      />
      <video v-else id="banner-img" loop autoplay muted>
        <source :src="banner" />
      </video>
      <div id="metadata">
        <div id="text">
          <p id="collection-title">collection name : {{ slug }} - token ID : {{ metadata.tokenId }}</p>
          <p id="title">{{ metadata.name }}</p>
          <p id="description">{{ metadata.description }}</p>
          <p id="contract">{{ metadata.contract.address }}</p>
        </div>
        <img :src="props.metadata.image.originalUrl" alt="image" id="NFT-img"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
#contract {
  margin-top: 2vh;
  color: white;
  font-size: 1rem;
}
#text {
  padding-right: 20px;
}
#NFT-img {
  width: 15vw;
  height: auto;
  border-radius: 5px;
}
#collection-title {
  color: darkgrey;
  font-size: 1rem;
  font-weight: bold;
}
#description {
  color: grey;
  font-size: 1rem;
}
#title {
  color: white;
  font-size: 2rem;
  font-weight: bold;
}
#metadata {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#banner-img {
  width: 100%;
}
#background {
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
#pop-up {
  width: 50vw;
  background-color: rgb(25, 25, 25);
  border-radius: 20px;
  overflow: hidden;
}
</style>
