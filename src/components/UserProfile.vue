<script setup lang="ts">
  import Dots3Icon from "../assets/3DotsIcon.svg"
  import TooltipCopy from './TooltipCopy.vue'

  const address = '0x79b505CAE4d1Ec0178EE7F375A1053971032E159'
</script>

<template>
  <div id="container">
    <div>
      <h1 id="name">Main Account</h1>
      <div id="address">
        <p>{{ address.slice(0, 18) }}</p>
        <TooltipCopy :address="address"/>
      </div>
    </div>
    <img :src="Dots3Icon" alt="icon" />
  </div>
  <div id="bottomLine" />
</template>

<style scoped>
  #container {
    padding-inline: 42px;
    padding-block: 32px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  #name {
    color: white;
  }
  #address {
    display: flex;
    flex-direction: row;
  }
  h1 {
    font-size: 27px;
  }
  p {
    color: #808080;
    font-size: 13px;
    margin-right: 11px;
  }
  img {
    height: 18px;
    width: 18px;
  }
  img:hover {
    cursor: pointer;
  }
  #bottomLine {
    width: 100%;
    height: 1px;
    background-color: #4E4E4E;
  }
</style>