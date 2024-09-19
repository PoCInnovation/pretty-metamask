<script lang="ts">
import mnemonicWord from '@/components/wallet/mnemonicWord.vue'

export default {
  name: 'mnemonicPopUp',
  components: {
    mnemonicWord
  },
  props: {
    mnemonic: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      mnemonicWords: this.mnemonic.split(' ') as string[]
    }
  },
  mounted() {
    this.$el.focus()
  }
}
</script>

<template>
  <div
    class="relative bg-background-gray rounded-lg w-2/3 h-2/3 p-6 md:p-8 lg:p-10 flex flex-col z-5000"
    @keydown.esc="$emit('close')"
    tabindex="0"
  >
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
      <mnemonicWord
        v-for="(word, index) in mnemonicWords"
        :key="word"
        :word="word"
        :index="index + 1"
      />
    </div>
    <div class="flex justify-end mt-4">
      <button @click="$emit('close')" class="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-auto self-end bg-blue-500 hover:bg-blue-700 text-white">Skip</button>
    </div>
  </div>
</template>
