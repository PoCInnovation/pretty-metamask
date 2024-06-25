import './assets/main.css'

import { createApp } from 'vue'
import App from '@/App.vue'
import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { sepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import axios from 'axios';

createApp(App).mount('#app')

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
const axiosURL = `${baseURL}`;

const ax = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const accounts = await wal_client.requestAddresses()
console.log(accounts)

export var pubClient = pub_client;
export var walClient = wal_client;
export var account = accounts[0];
export var x = ax;
