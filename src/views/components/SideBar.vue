<script setup>
import { useAuthStore } from '@/store/auth.js'

const authStore = useAuthStore()

</script>

<template>
  <div v-if="authStore.IsLoggedIn">
    hemlo bro i am sidebar
  </div>
</template>

<style scoped>

</style>