<template>
  <div id="container">
    <div class="input-container">
      <input type="text" v-model="userAddress" placeholder="Get balance for another address..." />
      <button>{{ currentMode }}</button>
      <button @click="handleButtonClick">Submit</button>
      
    </div>
    <p style="margin-left: 15px;" v-if="loading">Loading...</p>
    <div v-if="balances.length > 0" class="scroll-container scrollbar"  id="tokens">
      <ul>
        <li v-for="(balance, index) in balances" :key="index">
          <div v-if="balance.name != null" class="TokenBox">
            <div class="LogoName">
              <img :src="balance.logo" :alt="balance.name" />
              <span class="TitleToken">{{ balance.name }}</span>
            </div>
            <div class="Quantity">
              <span>{{ balance.balance }}</span>
            </div>
            <div class="SymbolPrice">
              <span>{{ balance.symbol }}</span>
              <span v-if="balance.balanceValue != null">{{ balance.balanceValue }}$</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <p v-if="error" style="margin: 5px 14px;">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watchEffect, watch } from 'vue';
import { processAll } from '../../../../alchemy';
import { chain } from '../../../../multichain'
import { useStore } from 'vuex';

export default defineComponent({
  name: 'TokenBalances',
  setup() {
    const store = useStore();
    const myChain = computed(() => store.getters.chain);
    const currentMode = ref(chain.value.alchemyNetwork);

    const userAddress = ref('');
    const balances = ref<Array<{ name: string; logo: string; balance: string; symbol: string; decimals: number; balanceValue: string | null }>>([]);
    const error = ref('');
    const loading = ref(false);

    const account = computed(() => store?.getters?.selectedAccount || '');

    const addressToDisplay = computed(() => {
      return userAddress.value.trim() || account.value;
    });

    const handleButtonClick = async () => {
      loading.value = true;
      error.value = '';
      balances.value = [];
      try {
        const addressToUse = addressToDisplay.value;
        if (!addressToUse) {
          error.value = 'No address provided.';
          return;
        }
        balances.value = await processAll(addressToUse, currentMode.value);
        if (balances.value.length === 0) {
          error.value = `No balances found for the address: ${addressToUse}.`;
        }
      } catch (err) {
        error.value = 'An error occurred while fetching balances.';
      } finally {
        loading.value = false;
      }
    };

    watch(
      () => chain.value,
      (newChain) => {
        currentMode.value = newChain.alchemyNetwork; // Update currentMode when chain changes
        handleButtonClick(); // Optionally refetch balances on chain change
      }
    );

    watchEffect(() => {
      handleButtonClick();
    });

    watchEffect(() => {
      if (myChain.value) {
        handleButtonClick();
      }
    });

    return {
      currentMode,
      userAddress,
      balances,
      error,
      loading,
      addressToDisplay,
      handleButtonClick
    };
  }
});
</script>

<style scoped>
#container {
  margin-top: 3.9vh;
  margin-bottom: 2.63vh;
  height: 27vh;
}

.scroll-container {
  max-height: 29vh;
  overflow-x: hidden;
  padding-right: 10px;
  margin: 0px 14px;
}

.TokenBox {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 10px 36px;
  margin-top: 1vh;
  border-radius: 10px;
  background-color: #2c3e50;
  transition: background-color 0.3s ease-in-out;
}

.TokenBox:hover {
  background-color: rgb(16, 19, 19); /* Darker background on hover */
}

.LogoName {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 25%;
  overflow: hidden;
}

.LogoName span {
  font-size: 16px;
  font-weight: bold;
}

.LogoName img {
  max-width: 50px;
  width: 2vw;
  height: auto;
  margin-right: 10px;
}

.Quantity {
  flex: 1;
  text-align: center;
  font-size: 16px;
  max-width: 35%; 
}

.SymbolPrice {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  max-width: 30%;
}

.SymbolPrice span {
  margin-left: 5px;
  text-align: right;
  overflow: hidden;
}

.TokenBox span {
  margin: 0 5px;
  color: aliceblue;
  white-space: nowrap;
}


.input-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 14px;
}

input[type="text"] {
  background-color: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 10px;
  padding: 10px;
  width: 300px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

input[type="text"]::placeholder {
  color: #aaa;
}

input[type="text"]:focus {
  border-color: #777; /* Lighter border color on focus */
  outline: none; /* Remove default outline */
}

button {
  background-color: #007BFF; /* Primary button color */
  color: white; /* Text color of the button */
  border: none; /* Remove default border */
  border-radius: 10px; /* Rounded corners */
  padding: 10px 20px; /* Padding inside the button */
  font-size: 16px; /* Font size */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s ease; /* Smooth transition for hover effect */
}

button:hover {
  background-color: #0056b3; /* Darker button color on hover */
}

.scrollbar
{
	margin-bottom: 25px;
  scrollbar-width: none;
}

#tokens::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 10px;
	background-color: #191919;
}

#tokens::-webkit-scrollbar
{
	width: 12px;
	background-color: #191919;
}

#tokens::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #2c3e50;
}

</style>