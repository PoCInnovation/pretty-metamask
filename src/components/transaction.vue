
<template>
    <div class="box">
        <div class="icone"></div>
        <div class="info">
            <h4 v-if="props.from">Sent {{ transInfos.value }} {{ transInfos.devise }}</h4>
            <h4 v-else>Receive {{ transInfos.value }} {{ transInfos.devise }}</h4>
            <h5 v-if="props.from">{{ transInfos.date }} to {{ reduceHashSize(transInfos.to) }}</h5>
            <h5 v-else>{{ transInfos.date }} from {{ reduceHashSize(transInfos.from) }}</h5>
        </div>
        <div class="status">
            <h5>Status</h5>
            <i>{{ transInfos.status }}</i>
        </div>
    </div>
</template>

<script setup lang="ts">
import { pubClient, x } from '../main';
import { ref, onMounted } from 'vue';
import { formatEther } from 'viem'

const props = defineProps({
    hash: String,
    devise: String,
    from: Boolean
})

const transInfos = ref({
    hash: "",
    to: "",
    from: "",
    blockHash: "",
    blockNumber: 0,
    value: "",
    status: "",
    timestamp: 0,
    date: "",
    devise: props.devise
})

const reduceHashSize = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

const getDateFormated = (timestamp: number) => {
    let date = new Date(timestamp * 1000);
    let options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    let formattedDate = date.toLocaleString('en-US', options as Intl.DateTimeFormatOptions);
    return formattedDate
}

const getInfos = () => {
    getTransactionInfos(props.hash as `0x${string}`)
}

const getTransactionInfos = async (transactionHash: `0x${string}`) => {
    const transactionInfos = await pubClient.getTransaction({
        hash: transactionHash
    })
    let data = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "eth_getBlockByHash",
        "params": [
            transactionInfos.blockHash,
            false
        ]
    }
    const transactionReceipt = await pubClient.getTransactionReceipt({
        hash: transactionHash
    })
    try {
        transInfos.value.timestamp = (await x.post('/', data)).data.result.timestamp
    } catch (error) {
        console.log(error)
    }
    transInfos.value.hash = transactionInfos.hash
    transInfos.value.to = String(transactionInfos.to)
    transInfos.value.from = transactionInfos.from
    transInfos.value.blockHash = transactionInfos.blockHash
    transInfos.value.blockNumber = Number(transactionInfos.blockNumber)
    transInfos.value.value = formatEther(transactionInfos.value)
    transInfos.value.status = transactionReceipt.status
    transInfos.value.date = getDateFormated(transInfos.value.timestamp)
    return transactionInfos
}

onMounted(() => {
    getInfos()
})
</script>

<style scoped>
.box {
    display: flex;
    justify-content: center;
    align-items: space-between;
    background-color: transparent;
    height: 75px;
    width: 95%;
    margin: 10px 0;
}

.icone {
    background-color: red;
    height: 100%;
    width: 20%;
}

.info {
    display: flex;
    padding: 0 10px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
    width: 60%;
}

.status {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 20%;
}

.info h4 {
    font-size: 22px;
    color: white;
}

.info h5 {
    font-size: 14px;
    color: #A3A3A3;

}

.status {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.status h5 {
    font-size: 14px;
    color: #A3A3A3;
}

h4 {
    font-size: 12px;
}

</style>