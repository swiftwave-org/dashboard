<script setup>
import { useAuthStore } from '@/store/auth.js'
import { RouterLink } from 'vue-router'
import Logo from '@/assets/images/logo-full-inverse.png'

const authStore = useAuthStore()
</script>

<template>
  <aside
    v-if="authStore.IsLoggedIn"
    class="flex h-screen flex-col overflow-y-auto border-r bg-primary-600 px-5 py-8">
    <RouterLink to="/">
      <img
        :src="Logo"
        alt="logo"
        class="max-w-[10vw]" />
    </RouterLink>

    <div class="mt-6 flex flex-1 flex-col justify-between">
      <nav class="-mx-3 space-y-6">
        <div class="space-y-3">
          <RouterLink
            class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-50 hover:text-gray-700"
            to="/dummy">
            <font-awesome-icon icon="fa-solid fa-hammer" />
            <span class="mx-2 text-sm font-medium">Deploy New Application</span>
          </RouterLink>
        </div>
        <div class="space-y-3">
          <label class="px-3 text-xs font-semibold uppercase text-white"> Project </label>
          <RouterLink
            class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
            to="/dummy">
            <font-awesome-icon icon="fa-solid fa-box" />
            <span class="mx-2 text-sm font-medium">Applications</span>
          </RouterLink>
          <RouterLink
            class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
            to="/dummy">
            <font-awesome-icon icon="fa-solid fa-hard-drive" />
            <span class="mx-2 text-sm font-medium">Persistent Volumes</span>
          </RouterLink>
        </div>
        <div class="space-y-3">
          <label class="px-3 text-xs font-semibold uppercase text-white"> Credentials </label>
          <RouterLink
            class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
            to="/git-credentials">
            <font-awesome-icon icon="fa-solid fa-code-branch" />
            <span class="mx-2 text-sm font-medium">Git Credentials</span>
          </RouterLink>
          <RouterLink
            class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
            to="/image-registry-credentials">
            <font-awesome-icon icon="fa-solid fa-cloud" />
            <span class="mx-2 text-sm font-medium">Image Reg Credentials</span>
          </RouterLink>
        </div>
        <div class="space-y-3">
          <label class="px-3 text-xs font-semibold uppercase text-white"> Routing </label>
          <RouterLink
            class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
            to="/domains">
            <font-awesome-icon icon="fa-solid fa-link" />
            <span class="mx-2 text-sm font-medium">Domains</span>
          </RouterLink>
          <RouterLink
            class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
            to="/dummy">
            <font-awesome-icon icon="fa-solid fa-network-wired" />
            <span class="mx-2 text-sm font-medium">Ingress Rules</span>
          </RouterLink>
          <RouterLink
            class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
            to="/dummy">
            <font-awesome-icon icon="fa-solid fa-location-arrow" />
            <span class="mx-2 text-sm font-medium">Redirect Rules</span>
          </RouterLink>
        </div>
        <div class="space-y-3">
          <label class="px-3 text-xs font-semibold uppercase text-white"> User </label>
          <RouterLink
            class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
            to="/users">
            <font-awesome-icon icon="fa-solid fa-users" />
            <span class="mx-2 text-sm font-medium">Manage Users</span>
          </RouterLink>
          <a
            class="flex transform cursor-pointer items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
            @click="authStore.Logout">
            <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
            <span class="mx-2 text-sm font-medium">Logout</span>
          </a>
        </div>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.router-link-exact-active {
  @apply bg-gray-100 text-gray-700;
}
</style>
