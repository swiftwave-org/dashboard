<script setup>
import { useAuthStore } from '@/store/auth.js'
import { RouterLink, useRouter } from 'vue-router'
import Logo from '@/assets/images/logo-full-inverse-subtitle.png'
import ChangePasswordModal from '@/views/partials/ChangePasswordModal.vue'
import { computed, onMounted, ref } from 'vue'
import SideBarOption from '@/views/partials/SideBarOption.vue'

const authStore = useAuthStore()
const router = useRouter()

const isChangePasswordModalOpen = ref(false)
const swVersion = ref('')
const openChangePasswordModal = () => {
  isChangePasswordModalOpen.value = true
}
const closeChangePasswordModal = () => {
  isChangePasswordModalOpen.value = false
}
const isShowSideBar = computed(() => {
  if (!authStore.IsLoggedIn) {
    return false
  } else {
    return !['Download Persistent Volume Backup', 'Maintenance', 'Setup'].includes(router.currentRoute.value.name)
  }
})

const logoutWithConfirmation = () => {
  if (confirm('Are you sure you want to logout?')) {
    authStore.Logout()
  }
}

onMounted(() => {
  if (authStore.IsLoggedIn) {
    authStore.fetchSWVersion().then((v) => {
      swVersion.value = v
    })
  }
})
</script>

<template>
  <aside
    v-if="isShowSideBar"
    class="scrollbox flex h-screen flex-col overflow-y-auto border-r bg-primary-600 px-2 pb-2 pt-6">
    <div class="px-3">
      <RouterLink to="/">
        <img :src="Logo" alt="logo" class="w-full max-w-40" />
      </RouterLink>
    </div>
    <div class="mt-6 flex flex-1 flex-col justify-between">
      <nav>
        <SideBarOption :active-urls="['Deploy Application', 'Deploy Stack', 'App Store', 'Install from App Store']">
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-hammer" />
          </template>
          <template #title> Deploy Application</template>
          <template #content>
            <div class="space-y-2">
              <RouterLink
                class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-50 hover:text-gray-700"
                to="/deploy/app-store">
                <font-awesome-icon icon="fa-solid fa-store" />
                <span class="mx-2 text-sm font-medium">App Store</span>
              </RouterLink>
              <RouterLink
                class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-50 hover:text-gray-700"
                to="/deploy/application">
                <font-awesome-icon icon="fa-solid fa-hammer" />
                <span class="mx-2 text-sm font-medium">Deploy Manually</span>
              </RouterLink>
              <RouterLink
                class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-50 hover:text-gray-700"
                to="/deploy/stack">
                <font-awesome-icon icon="fa-solid fa-cubes-stacked" />
                <span class="mx-2 text-sm font-medium">Deploy Stack</span>
              </RouterLink>
            </div>
          </template>
        </SideBarOption>

        <SideBarOption :active-urls="['Applications', 'Persistent Volumes']">
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-box" />
          </template>
          <template #title> Applications & Volumes</template>
          <template #content>
            <div class="space-y-2.5">
              <RouterLink
                class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                to="/applications">
                <font-awesome-icon icon="fa-solid fa-box" />
                <span class="mx-2 text-sm font-medium">Applications</span>
              </RouterLink>
              <RouterLink
                class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                to="/persistent-volumes">
                <font-awesome-icon icon="fa-solid fa-hard-drive" />
                <span class="mx-2 text-sm font-medium">Persistent Volumes</span>
              </RouterLink>
            </div>
          </template>
        </SideBarOption>

        <SideBarOption :active-urls="['Git Credentials', 'Image Registry Credentials']">
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-vault" />
          </template>
          <template #title>Manage Credentials</template>
          <template #content>
            <div class="space-y-2.5">
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
          </template>
        </SideBarOption>

        <SideBarOption :active-urls="['Domains', 'Redirect Rules', 'Ingress Rules']">
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-route" />
          </template>
          <template #title>Manage Routing</template>
          <template #content>
            <div class="space-y-2.5">
              <RouterLink
                class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                to="/domains">
                <font-awesome-icon icon="fa-solid fa-link" />
                <span class="mx-2 text-sm font-medium">Domains</span>
              </RouterLink>
              <RouterLink
                class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                to="/ingress-rules">
                <font-awesome-icon icon="fa-solid fa-network-wired" />
                <span class="mx-2 text-sm font-medium">Ingress Rules</span>
              </RouterLink>
              <RouterLink
                class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                to="/redirect-rules">
                <font-awesome-icon icon="fa-solid fa-location-arrow" />
                <span class="mx-2 text-sm font-medium">Redirect Rules</span>
              </RouterLink>
            </div>
          </template>
        </SideBarOption>

        <SideBarOption :active-urls="['Users']">
          <template #icon>
            <font-awesome-icon icon="fa-solid fa-gear" />
          </template>
          <template #title> Administration</template>
          <template #content>
            <div class="space-y-2.5">
              <RouterLink
                class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                to="/users">
                <font-awesome-icon icon="fa-solid fa-users" />
                <span class="mx-2 text-sm font-medium">Manage Users</span>
              </RouterLink>
              <div
                class="flex transform cursor-pointer items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                @click="openChangePasswordModal">
                <font-awesome-icon icon="fa-solid fa-key" />
                <span class="mx-2 text-sm font-medium">Change Password</span>
              </div>
              <RouterLink
                class="flex transform items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                to="/setup?update=1">
                <font-awesome-icon icon="fa-solid fa-wrench" />
                <span class="mx-2 text-sm font-medium">System Configuration</span>
              </RouterLink>
              <a
                class="flex transform cursor-pointer items-center rounded-lg px-3 py-2 text-gray-200 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                @click="logoutWithConfirmation">
                <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
                <span class="mx-2 text-sm font-medium">Logout</span>
              </a>
            </div>
          </template>
        </SideBarOption>
      </nav>
    </div>
    <div class="flex justify-between px-2 text-sm font-medium text-white">
      <span>Auto-logout {{ authStore.sessionRelativeTimeoutStatus }}</span>
      <span> v{{ swVersion }}</span>
    </div>
    <ChangePasswordModal :is-modal-open="isChangePasswordModalOpen" :close-modal="closeChangePasswordModal" />
  </aside>
</template>

<style scoped>
.router-link-exact-active {
  @apply bg-gray-100 text-gray-700;
}

.scrollbox::-webkit-scrollbar {
  width: 12px;
}

.scrollbox::-webkit-scrollbar-thumb {
  @apply rounded-full shadow-[inset_0_0_10px_10px_white];
  border: solid 3px transparent;
}
</style>
