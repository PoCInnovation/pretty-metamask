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
    showInfoToggle() {
      this.showInfo = true;
    },
    hideInfoToggle() {
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
      @mouseover="showInfoToggle"
      @mouseleave="hideInfoToggle"
    >
      <button class="btn btn-outline btn-primary text-xl">{{ word }}</button>
      <div v-show="showInfo && !copied" class="absolute bottom-full mb-2 px-2 py-1 bg-gray-800 rounded-lg transition-opacity duration-300"
           :class="{'opacity-100': showInfo}">
        <span class="text-white text-xs">Copiable!</span>
      </div>
      <div v-show="copied" class="absolute bottom-full mb-2 px-2 py-1 bg-green-500 rounded-lg transition-opacity duration-300"
           :class="{'opacity-100': copied, 'opacity-0': !copied}">
        <span class="text-xs text-white">Copied!</span>
      </div>
    </div>
  </div>
</template>
