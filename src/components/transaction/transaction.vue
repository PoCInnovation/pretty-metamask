<template>
  <div class="box" @click="openPopup()">
    <div class="icone">
      <svg style="fill: #D72F2F" v-if="fromMe" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32V288c0 17.7-14.3 32-32 32s-32-14.3-32-32V205.3L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160H384z"/></svg>
      <svg style="fill: #33BF41" v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32H544c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32s-32 14.3-32 32v82.7L342.6 137.4c-12.5-12.5-32.8-12.5-45.3 0L192 242.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0L320 205.3 466.7 352H384z"/></svg>
    </div>
    <div class="info">
      <h4 v-if="fromMe">
        <template v-if="Number(transInfos.value) < 0.0000000001 && Number(transInfos.value) != 0">
          Sent > 0.0000000001 {{ transInfos.devise }}
        </template>
        <template v-else>
          Sent {{ transInfos.value }} {{ transInfos.devise }}
        </template></h4>
      <h4 v-else>
        <template v-if="Number(transInfos.value) < 0.0000000001 && Number(transInfos.value) != 0">
          Received > 0.0000000001 {{ transInfos.devise }}
        </template>
        <template v-else>
          Received {{ transInfos.value }} {{ transInfos.devise }}
        </template>
      </h4>
      <h5 v-if="fromMe">{{ transInfos.date }} to {{ reduceHashSize(transInfos.to) }}</h5>
      <h5 v-else>{{ transInfos.date }} from {{ reduceHashSize(transInfos.from) }}</h5>
    </div>
    <div class="status">
      <h5>Status</h5>
      <svg style="fill: #33BF41" v-if="transInfos.status == 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
      <svg style="fill: #D72F2F" v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
    </div>
  </div>
  <transactionInfos v-if="popUp == true" :data="transInfos" @close-popUp="popUp = false" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { formatEther, getContract, type PublicClient } from 'viem';
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import transactionInfos from './transactionInfos.vue';
import { x } from '../../main';
import { fromHex } from 'viem'

const props = defineProps({
  hash: String,
  devise: String,
  from: Boolean
});

var pubClient: PublicClient;

const account = computed(() => store.getters.selectedAccount);
const popUp = ref(false);
const fromMe = ref(props.from);

interface Transaction {
  hash: string,
  to: string,
  from: string,
  blockHash: string,
  blockNumber: number,
  value: string,
  status: string,
  timestamp: number,
  date: string,
  devise: string,
  logs: {
    transaction: any,
    receipt: any,
    erc20: any,
  }
}

const transInfos = ref(<Transaction>{
  hash: "",
  to: "",
  from: "",
  blockHash: "",
  blockNumber: 0,
  value: "",
  status: "",
  timestamp: 0,
  date: "",
  devise: props.devise,
  logs: {
    transaction: {},
    receipt: {},
    erc20: {},
  }
});

const reduceHashSize = (hash: string) => {
  if (hash == account.value?.toLowerCase())
    return "Me";
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const openPopup = () => {
  popUp.value = true;
};

const getDateFormated = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options as Intl.DateTimeFormatOptions);
};

const getInfos = () => {
  const store = useStore();
  pubClient = store.getters.pubClient;
  if (account.value) {
    getTransactionInfos(props.hash as `0x${string}`);
  }
};

const getErc20Infos = async (transactionInfos: any, transactionReceipt: any, transInfos: any) => {
  try {
    const token = getContract({
      address: transactionReceipt.logs[0].address,
      abi: ERC20,
      client: pubClient
    });
    transInfos.value.devise = await token.read.symbol();
    const logs = await pubClient.getContractEvents({
      abi: ERC20,
      address: transactionReceipt.logs[0].address,
      fromBlock: transactionInfos.blockNumber,
      toBlock: transactionInfos.blockNumber,
      eventName: "Transfer"
    });
    transInfos.value.from = logs[0].args.from;
    transInfos.value.to = logs[0].args.to;
    transInfos.value.value = formatEther(logs[0].args.value as bigint);
    transInfos.value.logs.erc20 = logs;
  } catch (error) {
    console.log(error);
  }
};

const getTransactionInfos = async (transactionHash: `0x${string}`) => {
  var transactionInfos: any;
  var transactionReceipt: any;
  try {
    var transactionInfos = (await x.post('/', {
      "id": 1,
      "jsonrpc": "2.0",
      "method": "eth_getTransactionByHash",
      "params": [
        transactionHash
      ]
    })).data.result;
    var transactionReceipt = (await x.post('/', {
      "id": 1,
      "jsonrpc": "2.0",
      "method": "eth_getTransactionReceipt",
      "params": [
        transactionHash
      ]
    })).data.result;
    transInfos.value.timestamp = (await x.post('/', {
      "id": 1,
      "jsonrpc": "2.0",
      "method": "eth_getBlockByHash",
      "params": [
        transactionInfos.blockHash,
        false
      ]
    })).data.result.timestamp;
  }  catch (error) {
    console.log(error);
    console.log("transactionInfos: ", transactionInfos);
    console.log("transactionReceipt: ", transactionReceipt);
    console.log("transInfos: ", transInfos);
  }
  transInfos.value.hash = transactionInfos.hash;
  transInfos.value.to = transactionInfos.to;
  transInfos.value.from = transactionInfos.from;
  transInfos.value.blockHash = transactionInfos.blockHash;
  transInfos.value.blockNumber = fromHex(transactionInfos.blockNumber, "number");
  transInfos.value.value = formatEther(fromHex(transactionInfos.value, "bigint"));
  transInfos.value.status = parseInt(transactionReceipt.status, 16).toString() == "1" ? "success" : "failed";
  transInfos.value.date = getDateFormated(transInfos.value.timestamp);
  transInfos.value.logs.receipt = transactionReceipt;
  transInfos.value.logs.transaction = transactionInfos;
  if (!transInfos.value.devise)
    await getErc20Infos(transactionInfos, transactionReceipt, transInfos);
  return transactionInfos;
};

onMounted(() => {
  getInfos();
});
</script>

<style scoped>
.box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
    height: 75px;
    width: 100%;
    margin: 10px 0;
    cursor: pointer;
}

.icone {
    height: 100%;
    width: 15%;
    padding: 15px;
}

.icone svg {
    fill: #1E6BDE;
}

.info {
    display: flex;
    padding: 0 10px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
    width: 70%;
}

.status {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 15%;
}

.info h4 {
    font-size: 20px;
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

.status svg {
    height: 30px;
    width: 30px;
}

.status h5 {
    font-size: 14px;
    color: #A3A3A3;
}

h4 {
    font-size: 12px;
}

</style>