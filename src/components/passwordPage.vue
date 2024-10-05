<template>
  <div id="password-page">
    <img src="/img/PrettyMetaMask.png" alt="PrettyMetaMask Logo" class="logo" />
    <div v-if="havePassword">
      <h1 class="title">Enter your Password</h1>
      <input
        type="password"
        @keyup.enter="submitPassword"
        v-model="password"
        placeholder="Password"
      />
      <button class="btn" @click="submitPassword">Enter</button>
    </div>
    <div v-else>
      <h1 class="title">Create your Password</h1>
      <input type="password" v-model="password" placeholder="Password" />
      <button class="btn" @click="createPassword">Create</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue'
import CryptoJS from 'crypto-js'
import { useStore } from 'vuex'

const store = useStore()
const password = ref('')
const havePassword = ref(false)
const emit = defineEmits(['isOpen'])

const createPassword = () => {
  const hashedPassword = CryptoJS.SHA256(password.value).toString()
  localStorage.setItem('password', hashedPassword)
  localStorage.setItem('open-wallet', 'true')

  store.dispatch('addPassword', password.value)
  emit('isOpen')
}

const submitPassword = () => {
  const storedPassword = localStorage.getItem('password')
  if (!storedPassword) {
    alert('No password set')
    return
  }
  const hashedInputPassword = CryptoJS.SHA256(password.value).toString()
  if (hashedInputPassword === storedPassword) {
    localStorage.setItem('open-wallet', 'true')
    emit('isOpen')
    store.dispatch('addPassword', password.value)
  } else {
    alert('Incorrect password')
    password.value = ''
  }
}

onMounted(() => {
  const storedPassword = localStorage.getItem('password')
  if (storedPassword) {
    havePassword.value = true
  }
})
</script>

<style scoped>
#password-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #1e1e1e;
  padding: 20px;
}

.logo {
  width: 150px;
  margin-bottom: 20px;
}

.title {
  color: #ffffff;
  font-size: 30px;
  margin-bottom: 20px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

input[type='password'] {
  width: 300px;
  padding: 15px;
  font-size: 16px;
  border: 2px solid #4caf50;
  border-radius: 8px;
  outline: none;
  margin-bottom: 20px;
  background-color: #2c2c2c;
  color: white;
  transition: border-color 0.3s;
}

input[type='password']:focus {
  border-color: #6fff78;
}

.btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 30px;
  margin-left: 10px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.2s;
}

.btn:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.btn:active {
  background-color: #3e8e41;
  transform: translateY(0);
}

input::placeholder {
  color: #b0b0b0;
}

@media (max-width: 768px) {
  input[type='password'] {
    width: 80%;
  }

  .title {
    font-size: 24px;
  }

  .btn {
    font-size: 16px;
    padding: 12px 25px;
  }

  .logo {
    width: 100px;
  }
}
</style>
