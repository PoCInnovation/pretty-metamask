<script lang="ts">
export default {
  name: 'walletCard',
  props: {
    accountName: {
      type: String,
      required: true
    },
    accountAddress: {
      type: String,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false,
      required: true
    }
  }
}
</script>

<template>
  <div :class="['rounded-2xl p-2 pl-4 text-xl', isSelected ? 'bg-selected-blue hover:bg-blue-800' : 'border border-gray-600 bg-background-gray hover:bg-gray-600']" @click="$emit('select')">
    <div>{{ accountName }}</div>
    <div class="text-[#dbdbdb] text-sm">{{ accountAddress }}</div>
  </div>
</template>
