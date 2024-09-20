<script lang="ts">
import importCard from './importCard.vue'

export default {
  name: 'importPopUp',
  components: {
    importCard
  },
  data() {
    return {
      mnemonicWords: Array(12).fill('')
    }
  },
  mounted() {
    this.$el.focus()
  },
  methods: {
    closeWithoutMnemonic() {
      this.$emit('close')
    },
    closeWithMnemonic() {
      this.$emit('close', this.mnemonicWords)
    }
  }
}
</script>

<template>
  <div
    class="relative bg-background-gray rounded-lg w-2/3 h-2/3 p-6 md:p-8 lg:p-10 flex flex-col z-5000"
    @keydown.esc="closeWithoutMnemonic"
    tabindex="0"
  >
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
      <importCard
        v-for="index in 12"
        :key="index"
        :mnemonic-number="index"
        v-model="mnemonicWords[index - 1]"
      />
    </div>
    <button
      @click="closeWithMnemonic"
      class="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-auto self-end bg-blue-500 hover:bg-blue-700 text-white"
    >
      Import
    </button>
  </div>
</template>
