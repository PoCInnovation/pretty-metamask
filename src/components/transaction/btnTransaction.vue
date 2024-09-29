<template>
  <div class="btn">
    <h2>{{ props.txt }}</h2>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  txt: String
})
</script>

<style scoped>
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 60px;
  width: 200px;
  border-radius: 40px;
  background-color: #1e6bde;
  cursor: pointer;
}

h2 {
  color: white;
}
</style>
