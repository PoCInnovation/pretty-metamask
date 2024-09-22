<template>
  <div class="iconeBox">
    <img class="iconeBoxImage" style="cursor: zoom-in;" src="/img/gas-station.png" alt="Ether gas price">
    <p style="margin-right: 1.5rem;">{{gasValue}}</p>
    <button @click="toggleLock">
      <img :src="isLocked ? '/img/padlock.png' : '/img/unlock_padlock.png'" 
           :class="{'iconeBoxImage': true, 'blueLock': isLocked}" 
           alt="toggle lock">
    </button>
  </div>
</template> 

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { getGas } from '../../getGas'
import { Network } from 'alchemy-sdk';

export default defineComponent({
  name: 'HeaderMenu',
  setup() {
    // Reactive variable to toggle between locked/unlocked state
    const isLocked = ref(true);
    const gasValue = ref<string | null>(null);
    let intervalId: NodeJS.Timeout | undefined;


    // Function to toggle the lock state
    const toggleLock = () => {
      isLocked.value = !isLocked.value;
    };

    const fetchGasPrice = async () => {
      gasValue.value = await getGas(Network.ETH_MAINNET);
    };

    onMounted(() => {
      fetchGasPrice();
      intervalId = setInterval(fetchGasPrice, 5000);
    });

    onBeforeUnmount(() => {
      if (intervalId)
        clearInterval(intervalId);
    });

    return {
      gasValue,
      isLocked,
      toggleLock
    };
  }
});
</script>

<style scoped>
.iconeBox {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 0.5rem;
  margin-right: 2rem;
}

.iconeBoxImage {
  height: 1.5rem;
  width: 1.5rem;
  margin-right: 5px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

button:hover .iconeBoxImage {
  transform: scale(1.1);
}

.blueLock {
  filter: hue-rotate(200deg); /* Adds blue tint when locked */
}
</style>
