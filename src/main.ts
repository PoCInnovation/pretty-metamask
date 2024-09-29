import './assets/main.css'
import './index.css'
import Loading from './LoadingPage.vue'

const loading = createApp(Loading)
loading.mount('#loading')

import { createApp, nextTick, watch } from 'vue'
import App from './App.vue'
import axios from 'axios'
import store from './store'
import { chain } from './multichain'

console.log(`baseURL is: ${chain.value.alchemyURL}`);
const ax = axios.create({
  baseURL: chain.value.alchemyURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const x = ax

watch(
    () => chain.value.alchemyURL,
    (newURL: string) => {
      ax.defaults.baseURL = newURL;
      console.log(`Axios baseURL updated to: ${newURL}`);
    }
  );
  

const app = createApp(App)
app.use(store)
app.mount('#app')

nextTick().then(() => {
  loading.unmount()
})
