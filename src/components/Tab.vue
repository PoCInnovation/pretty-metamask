<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TabERC',
  props: {
    name: String,
    selected: Boolean,
  }
});
</script>

<template>
  <div id="tab" @click="$emit('select', name)">
    <div :class="{ 'tab--selected': selected }">
      {{ name }}
    </div>
  </div>
</template>

<style scoped>
#tab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: white;
}
.tab--selected {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1E6BDE;
  border-radius: 6px;
  height: 100%;
  width: 100%;
}
</style>