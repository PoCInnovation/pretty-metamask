<template>
    <div id="password-page" v-if="havePassword">
	    <h1 class="title">Enter your Password</h1>
	    <input type="password" v-model="password" placeholder="Password" />
	    <button class="btn" @click="submitPassword">Enter</button>
    </div>
    <div id="password-page" v-else>
        <h1 class="title">Create your Password</h1>
	    <input type="password" v-model="password" placeholder="Password" />
	    <button class="btn" @click="createPassword">Create</button>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue'
import CryptoJS from 'crypto-js'
import { useStore} from 'vuex'

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

input {
    color: black;
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