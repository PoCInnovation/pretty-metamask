<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ERC',
});
</script>

<script setup lang="ts">
import TabsERC from './Tabs.vue';
import Token from './Token.vue';
import NFT from './NFT.vue';
import { ref } from 'vue';
import Actions from './UserActions.vue';

const currentTab = ref('Token')
</script>

<template>
  <div id="middle">
    <Actions />
    <div id="ERC">
    <TabsERC @tab-change="currentTab = $event" />
      <Token v-if="currentTab === 'Token'" />
      <NFT v-else />
    </div>
  </div>
</template>

<style>
  #middle {
    width: 45.347vw;
    height: 80vh;
    background-color: rgb(25, 25, 25);
    border-radius: 20px;
  }
  #actions {
    height: 36vh;
  }
</style>