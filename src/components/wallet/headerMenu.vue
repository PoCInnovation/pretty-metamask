<template>
  <div class="iconeBox">
    <img class="iconeBoxImage" style="cursor: zoom-in;" src="/img/gas-station.png" alt="Ether gas price">
    <p style="margin-right: 1.5rem;">{{gasValue}}</p>
    <button @click="toggleLock">
      <img :src="!isLocked ? '/img/unlock_padlock.png' : '/img/padlock.png'" 
           class="iconeBoxImage" 
           alt="toggle lock">
    </button>
  </div>
</template> 

<script lang="ts">
import { chain } from '../../multichain'
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { getGas } from '../../getGas'
import { Network } from 'alchemy-sdk';

export default defineComponent({
  name: 'HeaderMenu',
  setup() {

    if (!sessionStorage.getItem('lock-wallet')) {
      sessionStorage.setItem('lock-wallet', 'true');
    }
    
    const isLocked = ref(sessionStorage.getItem('lock-wallet') === "true");

    const gasValue = ref<string | null>(null);
    let intervalId: NodeJS.Timeout | undefined;

    const toggleLock = () => {
      isLocked.value = !isLocked.value;
      sessionStorage.setItem('lock-wallet', String(isLocked.value))
    };

    const fetchGasPrice = async () => {
      gasValue.value = await getGas(chain.value.alchemyNetwork);
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
  /* margin-left: 0rem; */
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
</style>
