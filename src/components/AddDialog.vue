<template>
  <div id="transparent">
    <div id="dialog">
      <input v-model="smartContract" placeholder="Smart contract"/>
      <input v-model="tokenID" placeholder="Token ID"/>
      <button @click="getTokenURI">Add</button>
      <button @click="closeDialog">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
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
    height: 60vh;
    background-color: rgb(25, 25, 25);
    border-radius: 20px;
  }
</style>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { client } from '@/client'
import { wagmiContract } from '@/contract'

export default defineComponent({
  name: 'AddDialog',
  props: {
    visible: Boolean,
  },
  setup() {
    const smartContract = ref('0x57AD875bA75C17AF7a2b3068a9Fa22952797E856')
    const tokenID = ref('2')

    return {
      smartContract,
      tokenID
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog')
    },
    async getTokenURI() {
      try {
        const tokenURI = await client.readContract({
          ...wagmiContract(this.smartContract),
          functionName: 'tokenURI',
          args: [this.tokenID],
        })
        fetch('https://ipfs.io/ipfs/' + tokenURI.replace('ipfs://', ''))
          .then(response => response.json())
          .then(data => {
            this.$emit('data-retrieved', data)
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      } catch (error) {
        console.error(error)
      }
    }
  }
});
</script>