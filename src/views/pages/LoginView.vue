<script setup>
import Logo from '@/assets/images/logo-subtitle.png'
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import router from '@/router/index.js'
import FilledButton from '@/views/components/FilledButton.vue'

const username = ref('')
const password = ref('')
const authenticationStatus = reactive({
  visible: false,
  success: false,
  message: ''
})
const authStore = useAuthStore()

const login = async () => {
  let res = await authStore.Login(username.value, password.value)
  authenticationStatus.success = res.success
  authenticationStatus.message = res.message
  authenticationStatus.visible = true
  if (res.success) {
    // TODO: update this to redirect to dashboard
    await router.push({ name: 'Users' })
  }
}
</script>

<template>
  <div class="flex h-full min-w-[100vw] flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img alt="SwiftWave" class="mx-auto h-14 w-auto" v-bind:src="Logo" />
    </div>

    <div class="mt-12 sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- Alert  -->
      <div
        v-if="authenticationStatus.visible"
        :class="{
          'border-red-500 bg-red-50': !authenticationStatus.success,
          'border-green-500 bg-green-50': authenticationStatus.success
        }"
        class="mb-5 rounded border-s-4 p-4"
        role="alert">
        <strong
          :class="{
            'text-red-800': !authenticationStatus.success,
            'text-green-800': authenticationStatus.success
          }"
          class="block font-medium"
          >{{ authenticationStatus.message }}</strong
        >
      </div>
      <div
        v-else-if="!authenticationStatus.visible"
        class="mb-5 rounded border-s-4 border-gray-500 bg-gray-50 p-4"
        role="alert">
        <p>You can create <strong>admin</strong> from <strong>SwiftWave CLI</strong></p>
      </div>

      <!--   Login Form   -->
      <form class="space-y-6" @submit.prevent="login">
        <div>
          <label class="block text-sm font-medium leading-6 text-gray-900" for="username">Username</label>
          <div class="mt-2">
            <input
              id="username"
              v-model="username"
              autocomplete="username"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              name="username"
              placeholder="Enter username"
              required
              type="text" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium leading-6 text-gray-900" for="password">Password</label>
          <div class="mt-2">
            <input
              id="password"
              v-model="password"
              autocomplete="current-password"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter password"
              required
              type="password" />
          </div>
        </div>
        <div>
          <FilledButton :click="login" class="w-full"> Sign in </FilledButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
