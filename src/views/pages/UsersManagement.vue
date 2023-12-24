<script setup>
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed, reactive, ref } from 'vue'
import ModalDialog from '@/views/components/ModalDialog.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import PageBar from '@/views/components/PageBar.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const isModalOpen = ref(false)
const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}

// New user form state
const newUser = reactive({
  username: '',
  password: ''
})

const {
  mutate: createUser,
  onDone: onUserCreateSuccess,
  onError: onUserCreateFail
} = useMutation(
  gql`
    mutation ($input: UserInput!) {
      createUser(input: $input) {
        id
        username
      }
    }
  `,
  {
    variables: {
      input: newUser
    }
  }
)

onUserCreateSuccess(() => {
  closeModal()
  refetchUserList()
  newUser.username = ''
  newUser.password = ''
  toast.success('User created successfully')
})

onUserCreateFail((err) => {
  toast.error(err.message)
})

// Delete user mutation
const {
  mutate: deleteUser,
  onDone: onUserDeleteSuccess,
  onError: onUserDeleteFail
} = useMutation(gql`
  mutation ($id: Uint!) {
    deleteUser(id: $id)
  }
`)

onUserDeleteSuccess(() => {
  refetchUserList()
  toast.success('User deleted successfully')
})

onUserDeleteFail((err) => {
  toast.error(err.message)
})

// User list query
const {
  result: userListResult,
  loading,
  refetch: refetchUserList
} = useQuery(
  gql`
    query {
      users {
        id
        username
      }
    }
  `,
  null,
  {
    pollInterval: 10000
  }
)
const users = computed(() => userListResult.value?.users)
</script>

<template>
  <section class="mx-auto w-full max-w-7xl">
    <!-- Modal for new user -->
    <ModalDialog
      :close-modal="closeModal"
      :is-open="isModalOpen">
      <template v-slot:header>Create new user</template>
      <template v-slot:body>
        Enter the username and password for the new user.
        <form @submit.prevent="createUser">
          <!-- Username Field -->
          <div class="mt-4">
            <label
              class="block text-sm font-medium text-gray-700"
              for="username">
              Username
            </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="newUser.username"
                autocomplete="off"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                name="username"
                placeholder="Username"
                type="text" />
            </div>
          </div>
          <!-- Password Field -->
          <div class="mt-4">
            <label
              class="block text-sm font-medium text-gray-700"
              for="password">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="newUser.password"
                autocomplete="new-password"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                name="password"
                placeholder="Password"
                type="password" />
            </div>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <FilledButton
          :click="createUser"
          type="primary"
          >Create
        </FilledButton>
      </template>
    </ModalDialog>

    <!-- Top Page bar   -->
    <PageBar>
      <template v-slot:title>Users</template>
      <template v-slot:subtitle>
        Registered users can access the SwiftWave dashboard, allowing them to perform all actions and access all
        features
      </template>
      <template v-slot:buttons>
        <FilledButton
          :click="openModal"
          type="primary"
          >Create User
        </FilledButton>
      </template>
    </PageBar>

    <!-- Tables -->
    <div class="mt-8 min-w-full overflow-hidden border border-gray-200 md:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
              scope="col">
              <span>Username</span>
            </th>
            <th
              class="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
              scope="col">
              ID
            </th>
            <th
              class="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
              scope="col">
              Status
            </th>
            <th
              class="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
              scope="col">
              Role
            </th>
            <th
              class="px-4 py-3.5 text-right text-sm font-normal text-gray-700"
              scope="col">
              Actions
            </th>
          </tr>
        </thead>
        <tbody
          v-show="!loading"
          class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="user in users"
            v-bind:key="user.id">
            <td class="whitespace-nowrap px-4 py-4">
              <div class="text-sm font-medium text-gray-900">
                {{ user.username }}
              </div>
            </td>
            <td class="whitespace-nowrap px-12 py-4">
              <div class="text-sm text-gray-900">{{ user.id }}</div>
            </td>
            <td class="whitespace-nowrap px-4 py-4">
              <span class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                Active
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-4 text-sm text-gray-700">Administrator</td>
            <td class="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
              <a
                class="text-red-600"
                @click.prevent="deleteUser({ id: user.id })">
                Delete
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
