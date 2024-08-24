<template>
  <div id="container">
    <div class="input-container">
      <input type="text" v-model="userAddress" placeholder="Get balance for another address..." />
      <button @click="handleButtonClick">Submit</button>
    </div>
    <p v-if="loading">Loading...</p>
    <div v-if="balances.length > 0" class="scroll-container scrollbar"  id="tokens">
      <ul>
        <li v-for="(balance, index) in balances" :key="index">
          <div v-if="balance.name != null" class="TokenBox">
            <div class="TokenLeft">
              <img :src="balance.logo ? balance.logo : 'img/question.png'" :alt="balance.name" />
              <span class="TitleToken">{{ balance.name }}</span>
            </div>
            <div class="TokenRight">
              <span>{{ balance.balance }}</span>
              <span>{{ balance.symbol }}</span>
              <span>{{ balance.balanceValue }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <p v-if="error" style="margin: 5px 14px;">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watchEffect } from 'vue';
import { getBalances } from '../../../../alchemy';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'TokenBalances',
  setup() {
    const store = useStore();

    const userAddress = ref('');
    const balances = ref<Array<{ name: string | null; logo: string | null; balance: string; symbol: string | null; decimals: number | null; balanceValue: number | null }>>([]);
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
        balances.value = await getBalances(addressToUse);
        console.log(account.value);
        if (balances.value.length === 0) {
          error.value = `No balances found for the address: ${addressToUse}.`;
        }
      } catch (err) {
        error.value = 'An error occurred while fetching balances.';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    watchEffect(() => {
      handleButtonClick();
    });

    return {
      userAddress,
      balances,
      error,
      loading,
      account,
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

.TokenBox img {
  max-width: 50px;
  width: 2vw;
  height: auto; /* Maintain aspect ratio */
  margin-right: 10px; /* Spacing between image and text */
}

.TokenLeft {
  display: flex;
  align-items: center;
}

.TokenRight {
  display: flex;
  align-items: center;
  margin-left: auto; /* Push the right section to the right */
}

.TokenRight span {
  margin-left: 5px;
  text-align: right; /* Align text to the right */
}

.TokenBox span {
  margin: 0 5px;
  color: aliceblue;
  white-space: nowrap; /* Prevent line break for better alignment */
}

.TitleToken {
  font-weight: bold; /* Highlight the token name */
}

.input-container {
  display: flex;
  align-items: center; /* Vertically center the items */
  gap: 10px; /* Space between the input and button */
  margin: 0 14px;
}

input[type="text"] {
  background-color: #333; /* Dark background color */
  color: white; /* White text color */
  border: 1px solid #555; /* Subtle border color */
  border-radius: 10px; /* Rounded corners */
  padding: 10px; /* Padding inside the input */
  width: 300px; /* Fixed width for the input */
  font-size: 16px; /* Font size for better readability */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
  transition: border-color 0.3s ease; /* Smooth transition for focus effect */
}

input[type="text"]::placeholder {
  color: #aaa; /* Light grey placeholder text color */
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
	overflow-y: scroll;
	margin-bottom: 25px;
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