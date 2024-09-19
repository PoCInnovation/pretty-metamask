import './assets/main.css'
import './index.css'
import Loading from './LoadingPage.vue'

const loading = createApp(Loading)
loading.mount('#loading')

import { createApp, nextTick } from 'vue'
import App from './App.vue'
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import axios from 'axios'
import store from './store'

const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY
const baseURL = `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`;

const ax = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const x = ax;

const app = createApp(App)
app.use(store)
app.mount('#app')

nextTick().then(() => {
    loading.unmount()
})
