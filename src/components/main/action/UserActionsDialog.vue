<script setup lang="ts">
import SendAction from './actions/SendAction.vue'
import SwapAction from './actions/SwapAction.vue'
import BridgeAction from './actions/BridgeAction.vue'

defineProps(['type'])
</script>

<template>
  <div id="background">
    <SendAction v-if="type === 'send'" @close-dialog="$emit('close-dialog')" />
    <SwapAction v-if="type === 'swap'" @close-dialog="$emit('close-dialog')" />
    <BridgeAction v-if="type === 'bridge'" @close-dialog="$emit('close-dialog')" />
  </div>
</template>

<style scoped>
#background {
  display: flex;
  justify-content: center;
  padding-inline: 44px;
}
</style>
