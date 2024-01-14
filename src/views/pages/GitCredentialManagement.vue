<script setup>
import PageBar from '@/views/components/PageBar.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import ModalDialog from '@/views/components/ModalDialog.vue'
import { useToast } from 'vue-toastification'
import { computed, reactive, ref } from 'vue'
import Table from '@/views/components/Table/Table.vue'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@vue/apollo-composable'
import GitCredentialListRow from '@/views/partials/GitCredentialListRow.vue'
import TableMessage from '@/views/components/Table/TableMessage.vue'

const toast = useToast()
const isModalOpen = ref(false)
const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}

// New Git Credential form state
const newGitCredential = reactive({
  name: '',
  username: '',
  password: ''
})

const {
  mutate: createGitCredential,
  loading: isGitCredentialCreating,
  onDone: onGitCredentialCreateSuccess,
  onError: onGitCredentialCreateFail
} = useMutation(
  gql`
    mutation ($input: GitCredentialInput!) {
      createGitCredential(input: $input) {
        id
        name
        username
        password
      }
    }
  `,
  {
    variables: {
      input: newGitCredential
    }
  }
)

onGitCredentialCreateSuccess(() => {
  closeModal()
  refetchGitCredentialList()
  newGitCredential.name = ''
  newGitCredential.username = ''
  newGitCredential.password = ''
  toast.success('Git Credential created successfully')
})

onGitCredentialCreateFail((err) => {
  toast.error(err.message)
})

// Delete Git Credential mutation
const {
  mutate: deleteGitCredential,
  onError: onGitCredentialDeleteError,
  onDone: onGitCredentialDeleteSuccess
} = useMutation(
  gql`
    mutation ($id: Uint!) {
      deleteGitCredential(id: $id)
    }
  `,
  {
    variables: {
      id: ''
    }
  }
)

onGitCredentialDeleteError((err) => {
  toast.error(err.message)
})

onGitCredentialDeleteSuccess(() => {
  refetchGitCredentialList()
  toast.success('Git Credential deleted successfully')
})

const deleteGitCredentialWithConfirmation = (gitCredential) => {
  if (confirm(`Are you sure you want to delete Git Credential ${gitCredential.name}?\nExisting deployments using this Git Credential can't use this credential anymore.`)) {
    deleteGitCredential({ id: gitCredential.id })
  }
}

// List Git Credentials query
const {
  result: gitCredentialList,
  refetch: refetchGitCredentialList,
  onError: onGitCredentialListError
} = useQuery(
  gql`
    query {
      gitCredentials {
        id
        name
        username
        password
      }
    }
  `,
  null,
  {
    pollInterval: 10000
  }
)
const gitCredentials = computed(() => gitCredentialList.value?.gitCredentials ?? [])

onGitCredentialListError((err) => {
  toast.error(err.message)
})
</script>

<template>
  <section class="mx-auto w-full max-w-7xl">
    <!-- Modal for create -->
    <ModalDialog
      :close-modal="closeModal"
      :is-open="isModalOpen">
      <template v-slot:header>Add Git Credential</template>
      <template v-slot:body>
        Enter the necessary information for configuring the new Git Credential.
        <form @submit.prevent="">
          <!--  Name Field   -->
          <div class="mt-4">
            <label
              class="block text-sm font-medium text-gray-700"
              for="name">
              Name (Provide a name to identify the credential)
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="newGitCredential.name"
                autocomplete="off"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                name="name"
                placeholder="Name"
                type="text" />
            </div>
          </div>
          <!-- Username Field -->
          <div class="mt-4">
            <label
              class="block text-sm font-medium text-gray-700"
              for="username">
              Git Username
            </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="newGitCredential.username"
                autocomplete="off"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                name="username"
                placeholder="Git Username"
                type="text" />
            </div>
          </div>
          <!-- Password Field -->
          <div class="mt-4">
            <label
              class="block text-sm font-medium text-gray-700"
              for="password">
              Git Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="newGitCredential.password"
                autocomplete="new-password"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                name="password"
                placeholder="Git Password"
                type="text" />
            </div>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <FilledButton
          :click="createGitCredential"
          :loading="isGitCredentialCreating"
          type="primary"
          >Add Now
        </FilledButton>
      </template>
    </ModalDialog>

    <!-- Top Page bar   -->
    <PageBar>
      <template v-slot:title>Git Credentials</template>
      <template v-slot:subtitle> Manage Git Credentials and usage in deployments</template>
      <template v-slot:buttons>
        <FilledButton
          :click="openModal"
          type="primary"
          >Add New
        </FilledButton>
      </template>
    </PageBar>

    <!-- Table -->
    <Table class="mt-8">
      <template v-slot:header>
        <TableHeader align="left">Identifier Name</TableHeader>
        <TableHeader align="left">Username</TableHeader>
        <TableHeader align="left">Password</TableHeader>
        <TableHeader align="right">Actions</TableHeader>
      </template>
      <template
        v-if="gitCredentials.length === 0"
        v-slot:message>
        <TableMessage>
          No Git Credentials found.<br />
          Click on the Add New button to create a new Git Credential.
        </TableMessage>
      </template>
      <template v-slot:body>
        <GitCredentialListRow
          v-for="gitCredential in gitCredentials"
          v-bind:key="gitCredential.id"
          :delete-git-credential="deleteGitCredentialWithConfirmation"
          :git-credential="gitCredential" />
      </template>
    </Table>
  </section>
</template>

<style scoped></style>
