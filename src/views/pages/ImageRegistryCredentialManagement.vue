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
import TableMessage from '@/views/components/Table/TableMessage.vue'
import ImageRegistryCredentialListRow from '@/views/partials/ImageRegistryCredentialListRow.vue'

const toast = useToast()
const isModalOpen = ref(false)
const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}

// New Image Registry Credential form state
const newImageRegistryCredential = reactive({
  url: '',
  username: '',
  password: ''
})

const {
  mutate: createImageRegistryCredential,
  loading: isImageRegistryCredentialCreating,
  onDone: onImageRegistryCredentialCreateSuccess,
  onError: onImageRegistryCredentialCreateFail
} = useMutation(
  gql`
    mutation ($input: ImageRegistryCredentialInput!) {
      createImageRegistryCredential(input: $input) {
        id
        url
        username
        password
      }
    }
  `,
  {
    variables: {
      input: newImageRegistryCredential
    }
  }
)

onImageRegistryCredentialCreateSuccess(() => {
  closeModal()
  refetchImageRegistryCredentialList()
  newImageRegistryCredential.name = ''
  newImageRegistryCredential.username = ''
  newImageRegistryCredential.password = ''
  toast.success('Image Registry Credential created successfully')
})

onImageRegistryCredentialCreateFail((err) => {
  toast.error(err.message)
})

// Delete Image Registry Credential mutation
const {
  mutate: deleteImageRegistryCredential,
  onError: onImageRegistryCredentialDeleteError,
  onDone: onImageRegistryCredentialDeleteSuccess
} = useMutation(
  gql`
    mutation ($id: Uint!) {
      deleteImageRegistryCredential(id: $id)
    }
  `,
  {
    variables: {
      id: ''
    }
  }
)

onImageRegistryCredentialDeleteError((err) => {
  toast.error(err.message)
})

onImageRegistryCredentialDeleteSuccess(() => {
  refetchImageRegistryCredentialList()
  toast.success('Image Registry Credential deleted successfully')
})

const deleteImageRegistryCredentialWithConfirmation = (imageRegistryCredential) => {
  if (confirm(`Are you sure you want to delete Image Registry Credential ?\nExisting deployments using this Image Registry Credential can't use this credential anymore.`)) {
    deleteImageRegistryCredential({ id: imageRegistryCredential.id })
  }
}

// List Image Registry Credentials query
const {
  result: imageRegistryCredentialList,
  refetch: refetchImageRegistryCredentialList,
  onError: onImageRegistryCredentialListError
} = useQuery(
  gql`
    query {
      imageRegistryCredentials {
        id
        url
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
const imageRegistryCredentials = computed(() => imageRegistryCredentialList.value?.imageRegistryCredentials ?? [])

onImageRegistryCredentialListError((err) => {
  toast.error(err.message)
})
</script>

<template>
  <section class="mx-auto w-full max-w-7xl">
    <!-- Modal for create -->
    <ModalDialog
      :close-modal="closeModal"
      :is-open="isModalOpen">
      <template v-slot:header>Add Image Registry Credential</template>
      <template v-slot:body>
        Enter the necessary information for configuring the new Image Registry Credential.
        <form @submit.prevent="">
          <!--  Url Field   -->
          <div class="mt-4">
            <label
              class="block text-sm font-medium text-gray-700"
              for="url">
              URL (example: ghcr.io)
            </label>
            <div class="mt-1">
              <input
                id="url"
                v-model="newImageRegistryCredential.url"
                autocomplete="off"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                name="url"
                placeholder="URL"
                type="text" />
            </div>
          </div>
          <!-- Username Field -->
          <div class="mt-4">
            <label
              class="block text-sm font-medium text-gray-700"
              for="username">
              Image Registry Username
            </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="newImageRegistryCredential.username"
                autocomplete="off"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                name="username"
                placeholder="Image Registry Username"
                type="text" />
            </div>
          </div>
          <!-- Password Field -->
          <div class="mt-4">
            <label
              class="block text-sm font-medium text-gray-700"
              for="password">
              Image Registry Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="newImageRegistryCredential.password"
                autocomplete="new-password"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                name="password"
                placeholder="Image Registry Password"
                type="text" />
            </div>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <FilledButton
          :click="createImageRegistryCredential"
          :loading="isImageRegistryCredentialCreating"
          type="primary"
          >Add Now
        </FilledButton>
      </template>
    </ModalDialog>

    <!-- Top Page bar   -->
    <PageBar>
      <template v-slot:title>Image Registry Credentials</template>
      <template v-slot:subtitle> Manage Image Registry Credentials and usage in deployments</template>
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
        <TableHeader align="left">URL</TableHeader>
        <TableHeader align="left">Username</TableHeader>
        <TableHeader align="left">Password</TableHeader>
        <TableHeader align="right">Actions</TableHeader>
      </template>
      <template
        v-if="imageRegistryCredentials.length === 0"
        v-slot:message>
        <TableMessage>
          No Image Registry Credentials found.<br />
          Click on the Add New button to create a new Image Registry Credential.
        </TableMessage>
      </template>
      <template v-slot:body>
        <ImageRegistryCredentialListRow
          v-for="imageRegistryCredential in imageRegistryCredentials"
          v-bind:key="imageRegistryCredential.id"
          :delete-image-registry-credential="deleteImageRegistryCredentialWithConfirmation"
          :image-registry-credential="imageRegistryCredential" />
      </template>
    </Table>
  </section>
</template>

<style scoped></style>
