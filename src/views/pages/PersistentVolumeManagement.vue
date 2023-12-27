<script setup>
import PageBar from '@/views/components/PageBar.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import { useToast } from 'vue-toastification'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import Table from '@/views/components/Table/Table.vue'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import TableMessage from '@/views/components/Table/TableMessage.vue'
import TableRow from '@/views/components/Table/TableRow.vue'
import { computed, reactive, ref } from 'vue'
import TextButton from '@/views/components/TextButton.vue'
import ModalDialog from '@/views/components/ModalDialog.vue'

const toast = useToast()
const isModalOpen = ref(false)
const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}

// Create persistent volume
const newPersistentVolumeDetails = reactive({
  name: ''
})

const {
  mutate: registerPersistentVolume,
  loading: isDomainRegistering,
  onDone: onDomainRegisterSuccess,
  onError: onDomainRegisterFail
} = useMutation(
  gql`
    mutation ($input: PersistentVolumeInput!) {
      createPersistentVolume(input: $input) {
        id
        name
      }
    }
  `,
  {
    variables: {
      input: newPersistentVolumeDetails
    }
  }
)

onDomainRegisterSuccess(() => {
  closeModal()
  newPersistentVolumeDetails.name = ''
  refetchPersistentVolumes()
})

onDomainRegisterFail((err) => {
  toast.error(err.message)
})

// Delete persistent volume
const {
  mutate: deletePersistentVolume,
  onDone: onDomainDeleteSuccess,
  onError: onDomainDeleteFail
} = useMutation(
  gql`
    mutation ($id: Uint!) {
      deletePersistentVolume(id: $id)
    }
  `,
  {
    variables: {
      id: ''
    }
  }
)

const deletePersistentVolumeWithConfirmation = (persistent_volume) => {
  if (confirm('Are you sure you want to delete this persistent volume?')) {
    deletePersistentVolume({
      id: persistent_volume.id
    })
  }
}

onDomainDeleteSuccess(() => {
  toast.success('Persistent volume deleted successfully')
  refetchPersistentVolumes()
})

onDomainDeleteFail((err) => {
  toast.error(err.message)
})

// Fetch persistent volumes
const {
  result: persistentVolumesRaw,
  refetch: refetchPersistentVolumes,
  onError: onPersistentVolumesError
} = useQuery(gql`
  query {
    persistentVolumes {
      id
      name
    }
  }
`)

const persistentVolumes = computed(() => persistentVolumesRaw.value?.persistentVolumes ?? [])

onPersistentVolumesError((err) => {
  toast.error(err.message)
})
</script>

<template>
  <section class="mx-auto w-full max-w-7xl">
    <!-- Modal for create persistent volumes -->
    <ModalDialog :close-modal="closeModal" :is-open="isModalOpen">
      <template v-slot:header>Add New Persistent Volume</template>
      <template v-slot:body>
        Enter a unique name for the persistent volume.
        <form @submit.prevent="">
          <!--  Name Field   -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700" for="name"> Persistent Volume </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="newPersistentVolumeDetails.name"
                autocomplete="off"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                name="name"
                placeholder="Name of persistent volume"
                type="text" />
            </div>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <FilledButton :click="registerPersistentVolume" :loading="isDomainRegistering" type="primary"
          >Register
        </FilledButton>
      </template>
    </ModalDialog>

    <!-- Top Page bar   -->
    <PageBar>
      <template v-slot:title>Persistent Volume</template>
      <template v-slot:subtitle>Manage Persistent Volume</template>
      <template v-slot:buttons>
        <FilledButton :click="openModal" type="primary">Add New</FilledButton>
      </template>
    </PageBar>

    <!-- Table -->
    <Table class="mt-8">
      <template v-slot:header>
        <TableHeader align="left">Volume Name</TableHeader>
        <TableHeader align="center">ID</TableHeader>
        <TableHeader align="right">Actions</TableHeader>
      </template>
      <template v-slot:message>
        <TableMessage v-if="persistentVolumes.length === 0">
          No persistent volumes found.<br />
          Click on the "Add New" button to create a new persistent volume.
        </TableMessage>
      </template>
      <template v-slot:body>
        <tr v-for="volume in persistentVolumes" :key="volume.id">
          <TableRow align="left">
            <div class="text-sm font-medium text-gray-900">{{ volume.name }}</div>
          </TableRow>
          <TableRow align="center">
            <div class="text-sm text-gray-900">{{ volume.id }}</div>
          </TableRow>
          <TableRow align="right">
            <TextButton :click="() => deletePersistentVolumeWithConfirmation(volume)" type="danger">Delete</TextButton>
          </TableRow>
        </tr>
      </template>
    </Table>
  </section>
</template>

<style scoped></style>
