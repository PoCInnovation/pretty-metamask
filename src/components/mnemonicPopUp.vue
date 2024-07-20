<script lang="ts">
import mnemonicWord from '@/components/mnemonicWord.vue'

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
    class="relative bg-background-gray rounded-lg w-2/3 h-2/3 p-6 md:p-8 lg:p-10 flex flex-col"
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
      <button
        @click="$emit('close')"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Skip
      </button>
    </div>
  </div>
</template>
