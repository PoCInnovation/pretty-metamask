<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'NFTCard',
    props: {
      name: String,
      description: String,
      contentType: String,
      image: String
    },
    methods: {
      truncate(str: string, n: number) {
        return str.length > n ? str.slice(0, n - 1) + '...' : str;
      },
    }
  });
</script>

<template>
  <div id="card">
    <img v-if="!contentType || contentType.substring(0, 5) === 'image'" :src="image" alt="NFT">
    <video v-else id="video" loop autoplay muted>
      <source :src="image"/>
    </video>
    <div>
      <p id="title">{{ name }}</p>
      <p id="desc" v-if="description">{{ truncate(description, 100) }}</p>
    </div>
  </div>
</template>

<style scoped>
  #video {
    width: 80px;
    height: 80px;
    margin-right: 26px;
    border-radius: 20px;
    overflow: hidden;
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