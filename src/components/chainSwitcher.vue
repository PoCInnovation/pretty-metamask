<template>
    <div id="chain-switcher">
        <div class="dropdown">
            <div tabindex="0" role="button" class="btn m-1">chain : {{ chain.name }}</div>
            <ul tabindex="0" class="dropdown-content menu rounded-box z-[1] w-52 p-2 shadow">
                <li class="chain" v-for="(c, i) in chainLs" @click="switchChain(i)"><a>{{ c.name }}</a></li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SwitchChain } from '../multichain'
import { chain, chainLs } from '../multichain'

const switchChain = (index: number) => {
    SwitchChain(index)
    console.log(chain.value.name)
}

</script>

<style scoped>
.btn {
    background-color: #1E6BDE;
    border: #1E6BDE;
    color: white;
    font-size: 1.2rem;
}

.btn:hover {
    background-color: #144a9c;
}
.chain {
    cursor: pointer;
    color: white;
    font-size: 1rem;
}
.dropdown-content {
    background-color: #1E6BDE;
}
</style>