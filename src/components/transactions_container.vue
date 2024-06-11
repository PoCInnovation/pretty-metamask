<template>
    <button @click="btn()">get transactions</button>
    <main>
        <div class="title">Transactions</div>
        <div class="list">
            <transaction v-for="t in transactionshash" :hash="t.hash" :devise="t.devise" :from="t.from.valueOf()"/>
        </div>
        <div class="link">
            <h3 @click="walletLink()">View full history on etherscan</h3>
        </div>
    </main>
</template>


<script setup lang="ts">
import transaction from './transaction.vue'
import { x, account } from '../main'
import { ref } from 'vue'

const transactionshash = ref<{ hash: string, devise: string, from: Boolean }[]>([])

const walletLink = () => {
    window.open(`https://sepolia.etherscan.io/address/${account}`)
}

const btn = async () => {
    let transactions = await getTransactionsFrom()
    for (const transaction of transactions) {
        transactionshash.value.push({"hash": transaction.hash, devise: transaction.asset, from: true});
    }
    // transactions = await getTransactionsTo()
    // for (const transaction of transactions) {
    //     transactionshash.value.push({"hash": transaction.hash, devise: transaction.asset, from: false});
    // }
}

const getTransactionsFrom = async () => {
    let data = JSON.stringify({
        "jsonrpc": "2.0",
        "id": 0,
        "method": "alchemy_getAssetTransfers",
        "params": [
            {
            "fromBlock": "0x0",
            "toBlock": "latest",
            "toAddress": account,
            "category": ["external", "internal", "erc20"],
            "excludeZeroValue": true
            }
        ]
    });

    try {
        const transactions = (await x.post('/', data)).data.result.transfers
        console.log(transactions)
        return transactions
    } catch (error) {
        return []
    }
}

const getTransactionsTo = async () => {
    let data = JSON.stringify({
        "jsonrpc": "2.0",
        "id": 0,
        "method": "alchemy_getAssetTransfers",
        "params": [
            {
            "fromBlock": "0x0",
            "toBlock": "latest",
            "FromAddress": account,
            "category": ["external", "internal", "erc20"],
            "excludeZeroValue": true
            }
        ]
    });

    try {
        const transactions = (await x.post('/', data)).data.result.transfers
        console.log(transactions)
        return transactions
    } catch (error) {
        return []
    }
}

</script>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: #191919;
    height: 70vh;
    width: 50vh;
    padding: 0 20px;
    border-radius: 20px;
}

.list {
    width: 100%;
    height: calc(100% - 120px);
}

.title {
    width: 100%;
    height: 70px;
    color: white;
    font-size: 40px;
    margin-bottom: 10px;
    padding: 20px 0 20px 10px;
}

.link {
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.link h3 {
    color: #1E6BDE;
    font-size: 16px;
    text-decoration: underline;
    cursor: pointer;
}

button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: blue;
    height: min-content;
    width: min-content;
    margin-top: 20px;
    margin-left: 20px;
    border-radius: 10px;
    color: white;
    font-size: 20px;
    font-weight: bold;
}
</style>