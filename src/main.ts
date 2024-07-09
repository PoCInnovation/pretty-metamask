import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { sepolia } from 'viem/chains'
import axios from 'axios';


const pub_client = createPublicClient({
    chain: sepolia,
    transport: http(),
})

const wal_client = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum!),
})

const apiKey = import.meta.env.VITE_ALCHEMY_API_KEY
const baseURL = `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`;
//const axiosURL = `${baseURL}`;

const ax = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const accounts = await wal_client.requestAddresses()
console.log(accounts)

export const pubClient = pub_client;
export const walClient = wal_client;
export const account = accounts[0];
export const x = ax;

createApp(App).mount('#app')