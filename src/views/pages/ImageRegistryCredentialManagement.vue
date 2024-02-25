<script setup>
import PageBar from '@/views/components/PageBar.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import { useToast } from 'vue-toastification'
import { computed, ref } from 'vue'
import Table from '@/views/components/Table/Table.vue'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@vue/apollo-composable'
import TableMessage from '@/views/components/Table/TableMessage.vue'
import ImageRegistryCredentialListRow from '@/views/partials/ImageRegistryCredentialListRow.vue'
import CreateImageRegistryCredentialModal from '@/views/partials/CreateImageRegistryCredentialModal.vue'

const toast = useToast()

// Create Image Registry Credential
const createImageRegistryCredentialModalRef = ref(null)
const openCreateImageRegistryCredentialModal = computed(
  () => createImageRegistryCredentialModalRef.value?.openModal ?? (() => {})
)

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
  if (
    confirm(
      `Are you sure you want to delete Image Registry Credential ?\nExisting deployments using this Image Registry Credential can't use this credential anymore.`
    )
  ) {
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
    <CreateImageRegistryCredentialModal
      ref="createImageRegistryCredentialModalRef"
      :callback-on-create="refetchImageRegistryCredentialList" />

    <!-- Top Page bar   -->
    <PageBar>
      <template v-slot:title>Image Registry Credentials</template>
      <template v-slot:subtitle> Manage Image Registry Credentials and usage in deployments</template>
      <template v-slot:buttons>
        <FilledButton :click="openCreateImageRegistryCredentialModal" type="primary">Add New</FilledButton>
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
      <template v-if="imageRegistryCredentials.length === 0" v-slot:message>
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
