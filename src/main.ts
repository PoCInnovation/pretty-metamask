import './assets/main.css'
import './index.css'
import Loading from './LoadingPage.vue'

const loading = createApp(Loading)
loading.mount('#loading')

import { createApp, nextTick } from 'vue'
import App from './App.vue'
import axios from 'axios'
import store from './store'
import { chain } from './multichain'

const ax = axios.create({
    baseURL: chain.value.alchemyURL,
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
