<script setup>
import { RouterView } from 'vue-router'
import { onBeforeMount, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import SideBar from '@/views/partials/SideBar.vue'
import LoadingPage from '@/views/pages/LoadingPage.vue'
import NotAvailableOnMobile from '@/views/pages/NotAvailableOnMobile.vue'

const authStore = useAuthStore()

onBeforeMount(() => {
  const token = localStorage.getItem('token')
  if (token !== null) {
    authStore.SetCredential(token)
  }
})

onMounted(() => {
  authStore.StartAuthChecker(() => {
    authStore.Logout()
  })
})
</script>

<template>
  <LoadingPage :show="authStore.IsLoggingInProgress" />
  <div class="app">
    <SideBar class="w-80" />
    <div class="flex max-h-[100vh] w-full flex-col items-center overflow-y-auto p-6">
      <RouterView />
    </div>
  </div>
  <NotAvailableOnMobile />
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
}
</style>
