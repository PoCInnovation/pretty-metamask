import { createStore } from 'vuex';
import type { WalletClient } from 'viem';

interface Account {
  name: string;
  address: string;
  reducedAddress: string;
  mnemonic: string;
  wallet: WalletClient;
}

interface State {
  accounts: Account[];
  selectedAccount: string | null;
}

const state: State = {
  accounts: [],
  selectedAccount: null,
};

const mutations = {
  addAccount(state: State, account: Account) {
    account.reducedAddress = `${account.address.slice(0, 7)}...${account.address.slice(-5)}`;
    state.accounts.push(account);
    state.selectedAccount = account.address;
  },
  selectAccount(state: State, address: string) {
    state.selectedAccount = address;
  },
  clearAccounts(state: State) {
    state.accounts = [];
    state.selectedAccount = null;
  }
};

const actions = {
  addAccount({ commit }: { commit: Function }, account: Account) {
    commit('addAccount', account);
  },
  selectAccount({ commit }: { commit: Function }, address: string) {
    commit('selectAccount', address);
  },
  clearAccounts({ commit }: { commit: Function }) {
    commit('clearAccounts');
  }
};

const getters = {
  accounts: (state: State) => state.accounts,
  selectedAccount: (state: State) => state.selectedAccount,
  accountReducedAddresses: (state: State) => {
    return state.accounts.map(account => ({
      ...account,
      reducedAddress: `${account.address.slice(0, 7)}...${account.address.slice(-5)}`
    }));
  }
};

const store = createStore({
  state,
  mutations,
  actions,
  getters
});

export default store;
