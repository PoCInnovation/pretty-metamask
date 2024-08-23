<template>
    <div id="chain-switcher">
        <button @click="switchChain">Switch Chain</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SwitchChain } from '../multichain'

const idx = ref(0)
const switchChain = () => {
    SwitchChain(idx.value)
    if (idx.value == 0) {
        idx.value = 1
    } else {
        idx.value = 0
    }
}

</script>