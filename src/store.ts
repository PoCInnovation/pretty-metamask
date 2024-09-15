import { createStore } from 'vuex'
import type { WalletClient } from 'viem'

interface Account {
  name: string
  address: string
  reducedAddress: string
  wallet: WalletClient
  id: number
}

interface State {
  accounts: Account[]
  selectedAccount: string | null
  password: string | null
  walletCounter: number
}

const state: State = {
  accounts: [],
  selectedAccount: null,
  password: null,
  walletCounter: 0
}

const mutations = {
  addAccount(state: State, account: Account) {
    account.reducedAddress = `${account.address.slice(0, 7)}...${account.address.slice(-5)}`
    account.id = state.walletCounter
    state.accounts.push(account)
    state.selectedAccount = account.address
    state.walletCounter++
  },
  selectAccount(state: State, address: string) {
    state.selectedAccount = address
  },
  clearAccounts(state: State) {
    state.accounts = []
    state.selectedAccount = null
    state.walletCounter = 0
  },
  addPassword(state: State, password: string) {
    state.password = password
  },
  clearPassword(state: State) {
    state.password = null
  }
}

const actions = {
  addAccount({ commit }: { commit: Function }, account: Account) {
    commit('addAccount', account)
  },
  selectAccount({ commit }: { commit: Function }, address: string) {
    commit('selectAccount', address)
  },
  clearAccounts({ commit }: { commit: Function }) {
    commit('clearAccounts')
  },
  addPassword({ commit }: { commit: Function }, password: string) {
    commit('addPassword', password)
  },
  clearPassword({ commit }: { commit: Function }) {
    commit('clearPassword')
  }
}

const getters = {
  accounts: (state: State) => state.accounts,
  selectedAccount: (state: State) => state.selectedAccount,
  accountReducedAddresses: (state: State) => {
    return state.accounts.map(account => ({
      ...account,
      reducedAddress: `${account.address.slice(0, 7)}...${account.address.slice(-5)}`
    }))
  },
  password: (state: State) => state.password,
  walletCounter: (state: State) => state.walletCounter
}

const store = createStore({
  state,
  mutations,
  actions,
  getters
})

export default store
