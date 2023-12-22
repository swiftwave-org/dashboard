<script setup>
import { RouterView } from 'vue-router'
import { onBeforeMount } from 'vue'
import { useAuthStore } from '@/store/auth.js'

onBeforeMount(() => {
  const token = localStorage.getItem('token')
  if (token !== null) {
    useAuthStore().SetCredential(token)
  }
})
</script>

<template>
  <RouterView />
</template>
