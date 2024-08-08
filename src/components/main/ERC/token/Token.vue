<script lang="ts">
import { defineComponent } from 'vue';
import DisplayTokens from './ButtonBalance.vue';

export default defineComponent({
  name: 'TOKEN',
  components: {
    DisplayTokens,
  },
});
</script>

<template>
  <div id="container">
    <DisplayTokens />
  </div>
</template>

<style scoped>
  #container {
    margin-top: 3.9vh;
    margin-bottom: 2.63vh;
    height: 27vh;
  }
</style>