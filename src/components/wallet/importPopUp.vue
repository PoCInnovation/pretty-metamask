<script lang="ts">
export default {
  name: "importPopUp",
  mounted() {
    this.$el.focus()
  }
}
</script>

<template>
  <div
    class="w-2/3 h-2/3 relative bg-background-gray rounded-lg flex flex-col z-10"
    @keydown.esc="$emit('close')"
    tabindex="0"
  >
  </div>
</template>