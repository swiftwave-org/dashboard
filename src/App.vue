<script setup>
import { RouterView } from 'vue-router'
import { onBeforeMount } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import SideBar from '@/views/components/SideBar.vue'

onBeforeMount(() => {
  const token = localStorage.getItem('token')
  if (token !== null) {
    useAuthStore().SetCredential(token)
  }
})
</script>

<template>
  <div class="app">
    <SideBar />
    <RouterView class="p-3" />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
}
</style>
