<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'
import walletCard from '@/components/wallet/walletCard.vue'
import mnemonicPopUp from '@/components/wallet/mnemonicPopUp.vue'
import { generateWallet } from '@/utils/wallet'
import type { WalletClient } from 'viem'
import importPopUp from './importPopUp.vue'

interface Account {
  name: string
  address: string
  wallet: WalletClient
}

export default defineComponent({
  name: 'NavBar',
  components: {
    walletCard,
    mnemonicPopUp,
    importPopUp
  },
  computed: {
    ...mapGetters(['accounts', 'selectedAccount', 'accountReducedAddresses', 'password', 'walletCounter']),
    visibleMnemonicAccounts(): Account[] {
      return this.accounts.filter(
        (account: Account) => this.selectedAccount === account.address && this.isMnemonicVisible
      )
    },
  },
  data() {
    return {
      mnemonic: '',
      isMnemonicVisible: false,
      isImportVisible: false
    }
  },
  methods: {
    ...mapActions(['addAccount', 'selectAccount']),
    addAccountToStore() {
      const { newWallet, mnemonic } = generateWallet()
      const newAccount: Account = {
        name: `Account ${this.walletCounter + 1}`,
        address: newWallet.account.address,
        wallet: newWallet
      }
      this.mnemonic = mnemonic
      this.addAccount(newAccount)
      this.isMnemonicVisible = true
    },
    selectAccountInStore(address: string) {
      this.selectAccount(address)
    },
    closeMnemonicPopUp() {
      this.isMnemonicVisible = false
      this.mnemonic = ''
    },
    showImportPopUp() {
      this.isImportVisible = true
    },
    closeImportPopUp() {
      this.isImportVisible = false
    }
  },
})
</script>

<template>
  <div class="w-80 h-[90vh] bg-background-gray text-white flex flex-col">
    <div class="p-6 border-gray-700 flex items-center justify-center space-x-7">
      <img src="@/components/icons/wallet_icon.png" alt="wallet icon" class="h-7 w-8" />
      <span class="text-2xl">Wallets</span>
    </div>
    <div class="flex-1 overflow-y-auto">
      <div class="p-4 space-y-4">
        <walletCard
          v-for="account in accountReducedAddresses"
          :key="account.address"
          :accountName="account.name"
          :accountAddress="account.reducedAddress"
          :isSelected="selectedAccount === account.address"
          @select="selectAccountInStore(account.address)"
        />
        <div @click="addAccountToStore" class="bg-background-gray rounded-2xl p-3 flex items-center justify-center border-gray-600 border hover:bg-gray-600">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </div>
        <div @click="showImportPopUp" class="bg-background-gray rounded-2xl p-3 flex items-center justify-center border-gray-600 border hover:bg-gray-600">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a1 1 0 011 1v10.586l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L11 13.586V3a1 1 0 011-1z"/>
            <path d="M5 18a1 1 0 011-1h12a1 1 0 110 2H6a1 1 0 01-1-1z"/>
          </svg>
        </div>
      </div>
    </div>
    <div class="flex items-center cursor-pointer p-4 w-full">
      <img src="@/components/icons/setting_icon.png" alt="setting icon" class="h-6 w-6 m-4" />
      <span class="text-2xl">Settings</span>
    </div>
  </div>
  <div v-if="isImportVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <importPopUp
      @close="closeImportPopUp"
    />
  </div>
  <div v-if="isMnemonicVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <mnemonicPopUp
      v-for="account in visibleMnemonicAccounts"
      :key="account.address"
      :mnemonic="mnemonic"
      @close="closeMnemonicPopUp"
    />
  </div>
</template>
