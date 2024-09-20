<script setup lang="ts">
import Square2StackIcon from '@/assets/Square2StackIcon.svg'
import { ref } from 'vue'

const props = defineProps(['address'])
const copyAddress = () => {
  navigator.clipboard.writeText(props.address)
  tooltipText.value = 'Copied!'
  setTimeout(resetTooltipText, 1000)
}
const showTooltip = ref(false)
const tooltipText = ref('Copy address')
const resetTooltipText = () => {
  tooltipText.value = 'Copy address'
}
</script>

<template>
  <div class="tooltip-container">
    <img
      :src="Square2StackIcon"
      alt="icon"
      @click="copyAddress()"
      @mouseover="showTooltip = true"
      @mouseout="showTooltip = false"
    />
    <span v-if="showTooltip" class="tooltip-text">{{ tooltipText }}</span>
  </div>
</template>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}
img {
  width: 24px;
  height: 24px;
}
img:hover {
  cursor: pointer;
}
.tooltip-text {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}
.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
