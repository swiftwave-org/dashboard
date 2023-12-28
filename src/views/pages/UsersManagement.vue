<script setup>
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed, reactive, ref } from 'vue'
import ModalDialog from '@/views/components/ModalDialog.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import PageBar from '@/views/components/PageBar.vue'
import { useToast } from 'vue-toastification'
import Table from '@/views/components/Table/Table.vue'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import UserListRow from '@/views/partials/UserListRow.vue'
import TableMessage from '@/views/components/Table/TableMessage.vue'

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
  loading: isUserCreating,
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

const deleteUserWithConfirmation = (user) => {
  if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
    deleteUser({ id: user.id })
  }
}

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
  refetch: refetchUserList,
  onError: onUserListFetchFailed
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

onUserListFetchFailed((err) => {
  toast.error(err.message)
})
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
          :loading="isUserCreating"
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
          type="primary">
          Create User
        </FilledButton>
      </template>
    </PageBar>

    <!-- Tables -->
    <Table class="mt-8">
      <template v-slot:header>
        <TableHeader align="left">Username</TableHeader>
        <TableHeader align="left">ID</TableHeader>
        <TableHeader align="center">Status</TableHeader>
        <TableHeader align="left">Role</TableHeader>
        <TableHeader align="right">Actions</TableHeader>
      </template>
      <template v-slot:message>
        <TableMessage v-if="!users"> Loading users... </TableMessage>
        <TableMessage v-else-if="users.length === 0">
          No users found.<br />
          Click on the "Create User" button to create a new user.
        </TableMessage>
      </template>
      <template v-slot:body>
        <UserListRow
          v-for="user in users"
          v-bind:key="user.id"
          :delete-user="deleteUserWithConfirmation"
          :user="user" />
      </template>
    </Table>
  </section>
</template>
