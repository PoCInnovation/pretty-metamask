<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AddBtn',
  props: {
    label: {
      type: String,
      required: true
    }
  }
})
</script>

<template>
  <div id="center">
    <button id="btn">Add {{ label }}</button>
  </div>
</template>

<style scoped>
#btn {
  background-color: rgb(25, 25, 25);
  color: white;
  font-size: 16px;
  border: 2px solid #1e6bde;
  width: 15.5vw;
  height: 5vh;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
#btn:hover {
  background-color: #1e6bde;
}
#btn:active {
  background-color: #1a5cbd;
  border: 2px solid #1a5cbd;
}
</style>
