<script setup lang="ts">
import SendAction from './actions/SendAction.vue'

defineProps(['type'])
</script>

<template>
  <div id="background">
    <SendAction v-if="type === 'send'" @close-dialog="$emit('close-dialog')" />
  </div>
</template>

<style scoped>
#background {
  display: flex;
  justify-content: center;
  padding-inline: 44px;
}
</style>
