<script setup lang="ts">
  import VerticalNavbar from "./components/wallet/verticalNavbar.vue";
  import transactions_container from "./components/transaction/transactions_container.vue";
  import ERC from "./components/main/ERC/ERC.vue";
  import { onMounted, ref, onUnmounted } from "vue";
  import passwordPage from "./components/passwordPage.vue";
  import HeaderMenu from "./components/wallet/headerMenu.vue"
  import { useStore } from 'vuex'

  const open = ref(false)
  const store = useStore()

  onMounted(() => {
    let isOpen: string | null;
    if (sessionStorage.getItem('lock-wallet')) {
      isOpen = localStorage.getItem('open-wallet')
      if (isOpen === 'true') {
        open.value = true
      }
    } else {
      isOpen = "false";
      open.value = false
    }
    // const store = useStore()
    // SwitchChain(store)

    setInterval(checkOpen, 5000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (sessionStorage.getItem('lock-wallet') === 'true') {
          open.value = false;
          localStorage.setItem('open-wallet', 'false');
          store.dispatch('clearPassword')
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    onUnmounted(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
  })

  function checkOpen() {
    const isOpen = localStorage.getItem('open-wallet')
    if (isOpen === 'true') {
      open.value = true
    } else {
      open.value = false
    }
  }
</script>

<template>
  <div v-if="open" id="container">
    <header>
      <div class="logo"><h1>✨Pretty-Metamask✨</h1></div>
      <div class="boxHeaderMenu">
        <chainSwitcher />
        <HeaderMenu />
      </div>
    </header>
    <main>
      <VerticalNavbar />
      <div id="info">
        <div />
        <ERC />
        <div id="transactions">
          <transactions_container />
        </div>
        <div />
      </div>
    </main>
  </div>
  <div v-else>
    <passwordPage @isOpen="checkOpen()"/>
  </div>
</template>

<style scoped>
  #container {
    height: 100vh;
    background-color: rgb(3, 3, 3);
  }
  header {
    height:10vh;
    background-color: rgb(25, 25, 25);
    color: white;
    width: 100vw;
    border-bottom: 1px solid rgb(3, 3, 3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5vw;
  }

  .boxHeaderMenu {
    display: flex;
  }
  .logo {
    font-size: 2.4rem;
  }
  main {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 90vh;
  }
  #info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  #transactions {
    width: 27.91vw;
    height: 80vh;
    background-color: rgb(25, 25, 25);
    border-radius: 20px;
  }
</style>
