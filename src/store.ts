import { createStore } from 'vuex';
import type { PublicClient, WalletClient } from 'viem';
import { createPublicClient, http } from 'viem'
import { switchChain } from 'viem/actions';
import { chain } from './multichain';

const pub_client = createPublicClient({
  chain: chain.value.chain,
  transport: http(),
})

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
  pubClient: PublicClient;
}

const state: State = {
  accounts: [],
  selectedAccount: null,
  chain: chain.value.chain,
  pubClient: pub_client
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
      switchChain(account.wallet, state.chain as typeof pub_client.chain);
    });
  },
  saveChain(state: State, chain: any) {
    state.chain = chain;
  },
  savePubClient(state: State, pubClient: any) {
    state.pubClient = pubClient;
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
  },
  savePubClient({ commit }: { commit: Function }, pubClient: any) {
    commit('savePubClient', pubClient);
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
  chain: (state: State) => state.chain,
  pubClient: (state: State) => state.pubClient
};

const store = createStore({
  state,
  mutations,
  actions,
  getters
});

export default store;
