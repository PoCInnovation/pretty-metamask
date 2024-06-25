<script lang="ts">
import { defineComponent } from 'vue';
import TabERC from './Tab.vue';

export default defineComponent({
  name: 'TabsERC',
  components: {
    TabERC,
  },
  data() {
    return {
      tabs: ['Token', 'NFT'],
      selectedTab: 'Token',
    };
  },
  watch: {
    selectedTab(newTab) {
      this.$emit('tab-change', newTab);
    },
  },
});
</script>

<template>
  <div id="tabs">
    <TabERC
      v-for="tab in tabs"
      :key="tab"
      :name="tab"
      :selected="tab === selectedTab"
      @select="selectedTab = $event"
      />
  </div>
</template>

<style scoped>
  #tabs {
    border: 1px solid #4E4E4E;
    height: 4vh;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    margin-inline: 15px;
    padding: 4px;
  }
</style>