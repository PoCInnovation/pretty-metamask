import { createStore } from 'vuex';
import type { WalletClient } from 'viem';
import { switchChain } from 'viem/actions';
import { pubClient } from './main'

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
  chain: any | null;
}

const state: State = {
  accounts: [],
  selectedAccount: null,
  chain: null,
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
  },
  switchWalletChain(state: State) {
    state.accounts.forEach(account => {
      switchChain(account.wallet, state.chain as typeof pubClient.chain);
    });
  },
  saveChain(state: State, chain: any) {
    state.chain = chain;
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
  },
  switchWalletChain({ commit }: { commit: Function }) {
    commit('switchWalletChain');
  },
  saveChain({ commit }: { commit: Function }, chain: any) {
    commit('saveChain', chain);
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
  },
  chain: (state: State) => state.chain
};

const store = createStore({
  state,
  mutations,
  actions,
  getters
});

export default store;
