<script lang="ts">
export default {
  name: 'importCard',
  props: {
    mnemonicNumber: {
      type: Number,
      required: true
    },
    modelValue: {
      type: String,
      required: true,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  methods: {
    updateValue(event: Event) {
      const value = (event.target as HTMLInputElement).value
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<template>
  <input
    type="text"
    :placeholder="`Word ` + mnemonicNumber"
    class="input input-bordered w-full max-w-xs"
    :value="modelValue"
    @input="updateValue"
  />
</template>
