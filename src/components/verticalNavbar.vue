<script lang="ts">
import { defineComponent } from 'vue'
import walletCard from '@/components/walletCard.vue'
import mnemonicPopUp from '@/components/mnemonicPopUp.vue'
import { generateWallet } from '@/utils/wallet'

interface account {
  name: string
  address: string
  mnemonic: string
}

export default defineComponent({
  name: "NavBar",
  components: {
    walletCard,
    mnemonicPopUp,
  },
  data() {
    return {
      accounts: [] as account[],
      selectedAccount: null as string | null,
      isMnemonicVisible: false
    }
  },
  computed: {
    visibleMnemonicAccounts(): account[] {
      return this.accounts.filter(account => this.selectedAccount === account.address && this.isMnemonicVisible)
    }
  },
  methods: {
    addAccount() {
      const { newWallet, mnemonic } = generateWallet()
      const newAccount: account = {
        name: `Account ${this.accounts.length + 1}`,
        address: this.reduceAddress(newWallet.account.address),
        mnemonic: mnemonic
      }
      this.accounts.push(newAccount)
      this.selectedAccount = newAccount.address
      this.isMnemonicVisible = true
    },
    reduceAddress(address: string) {
      return `${address.slice(0, 7)}...${address.slice(-5)}`
    },
    selectAccount(address: string) {
      this.selectedAccount = address
    },
    closePopUp() {
      this.isMnemonicVisible = false
    }
  }
})
</script>

<template>
  <div class="w-80 h-[90vh] mt-[10vh] bg-background-gray text-white flex flex-col">
    <div class="p-6 border-gray-700 flex items-center justify-center space-x-7">
      <img src="@/components/icons/wallet_icon.png" alt="wallet icon" class="h-7 w-8" />
      <span class="text-2xl">Wallets</span>
    </div>
    <div class="flex-1 overflow-y-auto">
      <div class="p-4 space-y-4">
        <walletCard
          v-for="account in accounts"
          :key="account.address"
          :accountName="account.name"
          :accountAddress="account.address"
          :isSelected="selectedAccount === account.address"
          @select="selectAccount(account.address)"
        />
        <div @click="addAccount" class="bg-background-gray rounded-2xl p-3 flex items-center justify-center border-gray-600 border hover:bg-gray-600">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </div>
      </div>
    </div>
    <div class="flex items-center cursor-pointer p-4 w-full">
      <img src="@/components/icons/setting_icon.png" alt="setting icon" class="h-6 w-6 m-4" />
      <span class="text-2xl">Settings</span>
    </div>
  </div>
  <div v-if="isMnemonicVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <mnemonicPopUp
        v-for="account in visibleMnemonicAccounts"
        :key="account.address"
        :mnemonic="account.mnemonic"
        @close="closePopUp"
      />
  </div>
</template>
