<template>
  <div>
    <input type="text" v-model="address" placeholder="Enter address..." />
    <button @click="handleButtonClick">Submit</button>
    <p v-if="loading">Loading...</p>
    <div v-if="balances.length > 0">
      <h3>Balances for {{ address }}:</h3>
      <ul>
        <li v-for="(balance, index) in balances" :key="index">
          {{ balance.name }}: {{ balance.balance }} {{ balance.symbol }} (decimals: {{ balance.decimals }})
        </li>
      </ul>
    </div>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getBalances } from './../api/alchemy';

export default defineComponent({
  data() {
    return {
      address: '',
      balances: [] as Array<{ name: string; balance: string; symbol: string; decimals: number }>,
      error: '',
      loading: false
    };
  },
  methods: {
    async handleButtonClick() {
      this.loading = true;  // Set loading to true when starting to fetch data
      this.error = '';
      this.balances = [];

      try {
        this.balances = await getBalances(this.address);
        if (this.balances.length === 0) {
          this.error = 'No balances found for this address or an error occurred.';
        }
      } catch (error) {
        this.error = 'An error occurred while fetching balances.';
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>