<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const stack = route.query.stack

onMounted(() => {
  if (!stack) {
    router.push({ name: 'App Store' })
  }
})
</script>

<template>
  <section class="mx-auto mt-2 flex w-full max-w-7xl flex-col items-center overflow-hidden">
    App Install<br />

    <p>Stack URL - {{ $route.query.stack }}</p>
  </section>
</template>

<style scoped></style>
