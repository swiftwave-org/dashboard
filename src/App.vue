<script setup>
import { RouterView } from 'vue-router'
import { onBeforeMount } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import SideBar from '@/views/partials/SideBar.vue'

const authStore = useAuthStore()

onBeforeMount(() => {
  const token = localStorage.getItem('token')
  if (token !== null) {
    authStore.SetCredential(token)
  }
})
</script>

<template>
  <div class="app">
    <SideBar class="w-80" />
    <div class="flex w-full flex-col items-center p-6">
      <RouterView />
    </div>
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
