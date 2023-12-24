<script setup>
import Logo from '@/assets/images/logo-subtitle.png'
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import router from '@/router/index.js'

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
  <div class="flex min-h-100 min-w-[100vw] flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-14 w-auto" v-bind:src="Logo" alt="SwiftWave" />
    </div>

    <div class="mt-12 sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- Alert  -->
      <div
        v-if="authenticationStatus.visible"
        role="alert"
        class="rounded border-s-4 p-4 mb-5 mb-5"
        :class="{
          'border-red-500 bg-red-50': !authenticationStatus.success,
          'border-green-500 bg-green-50': authenticationStatus.success
        }"
      >
        <strong
          class="block font-medium"
          :class="{
            'text-red-800': !authenticationStatus.success,
            'text-green-800': authenticationStatus.success
          }"
          >{{ authenticationStatus.message }}</strong
        >
      </div>
      <div
        v-else-if="!authenticationStatus.visible"
        role="alert"
        class="rounded border-s-4 p-4 mb-5 mb-5 border-gray-500 bg-gray-50"
      >
        <p>You can create <strong>admin</strong> from <strong>SwiftWave CLI</strong></p>
      </div>

      <!--   Login Form   -->
      <form class="space-y-6" @submit.prevent="login">
        <div>
          <label for="username" class="block text-sm font-medium leading-6 text-gray-900"
            >Username</label
          >
          <div class="mt-2">
            <input
              v-model="username"
              id="username"
              name="username"
              type="text"
              autocomplete="username"
              placeholder="Enter username"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
            >Password</label
          >
          <div class="mt-2">
            <input
              v-model="password"
              id="password"
              type="password"
              autocomplete="current-password"
              placeholder="Enter password"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-brand-600 px-3 py-1.5 text-base font-semibold leading-6 text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
