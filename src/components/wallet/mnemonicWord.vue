<script lang="ts">
export default {
  name: 'mnemonicWord',
  props: {
    word: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      copied: false,
      showInfo: false
    }
  },
  methods: {
    copyWord() {
      navigator.clipboard.writeText(this.word).then(() => {
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    },
    showInfo() {
      this.showInfo = true;
    },
    hideInfo() {
      this.showInfo = false;
    }
  }
}
</script>

<template>
  <div class="flex items-center space-x-1">
    <span class="text-white p-6">{{ index }}.</span>
    <div
      class="relative flex items-center justify-center space-x-1 cursor-pointer"
      @click="copyWord"
      @mouseover="showInfo"
      @mouseleave="hideInfo"
    >
      <div :class="['bg-gray-800 items-center justify-center border border-gray-700 rounded-lg flex py-4 px-12 transition-all', { 'bg-green-500': copied }]">
        <span class="text-white text-lg">{{ word }}</span>
      </div>
      <div v-if="showInfo && !copied" class="absolute bottom-full mb-2 px-2 py-1 bg-black rounded-lg">
        <span class="text-xs text-white">Click to copy</span>
      </div>
      <div v-if="copied" class="absolute bottom-full mb-2 px-2 py-1 bg-green-500 rounded-lg">
        <span class="text-xs text-white">Copied !</span>
      </div>
    </div>
  </div>
</template>
