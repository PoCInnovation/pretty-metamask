<template>
    <div id="password-page">
	    <h1 class="title">Enter Password</h1>
	    <input type="password" v-model="password" placeholder="Password" />
	    <button class="btn" @click="submitPassword">Submit</button>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const password = ref('')
const emit = defineEmits(['isOpen'])

const submitPassword = () => {
    const storedPassword = localStorage.getItem('password')
    if (password.value === storedPassword) {
        localStorage.setItem('open-wallet', 'true')
        emit('isOpen')
    } else {
        alert('Incorrect password')
    }
}
</script>

<style scoped>
.title {
  color: white;
  font-size: 25px;
  margin: 5px;
}

.btn {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 20px;
}

#password-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: rgb(25, 25, 25);
}

input {
  margin-bottom: 10px;
}
</style>