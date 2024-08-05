<script setup lang="ts">
import UserActionsDialog from './UserActionsDialog.vue'
import { ref } from 'vue'

const isAction = ref(false);
const typeOfAction = ref('');

const manageDialog = (type: string) => {
  isAction.value = !isAction.value;
  typeOfAction.value = type;
}
</script>

<template>
  <div id="container">
    <div v-if="!isAction" id="btn">
      <button @click="manageDialog('send')">Send</button>
      <button>Swap</button>
      <button>Bridge</button>
    </div>
    <UserActionsDialog v-if="isAction" :type="typeOfAction" @close-dialog="manageDialog"/>
  </div>
</template>

<style scoped>
  #btn {
    display: flex;
    justify-content: center;
    padding-inline: 44px;
  }
  button {
    width: 100%;
    height: 3.9vh;
    border-radius: 10px;
    border: none;
    background-color: #1E6BDE;
    color: white;
    font-size: 20px;
    margin-inline: 10px;
  }
  button:hover {
    cursor: pointer;
  }
  button:active {
    background-color: #1a5cbd;
  }
  #container {
    height: 7.8vh;
  }
</style>