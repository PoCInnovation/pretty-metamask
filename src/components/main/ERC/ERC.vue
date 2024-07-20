<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ERC',
});
</script>

<script setup lang="ts">
import TabsERC from '@/components/main/ERC/tab/Tabs.vue';
import Token from './token/Token.vue';
import NFT from './NFT/NFT.vue';
import { ref } from 'vue';
import Actions from '@/components/main/action/UserActionsButton.vue';
import UserProfile from '../user-info/UserProfile.vue'
import UserInfos from '@/components/main/user-info/UserInfos.vue'

const currentTab = ref('Token')
</script>

<template>
  <div id="middle">
    <UserProfile />
    <Suspense>
      <UserInfos />
    </Suspense>
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
    overflow: hidden;
  }
</style>