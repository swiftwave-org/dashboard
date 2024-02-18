<script setup>
import PageBar from '@/views/components/PageBar.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import { useToast } from 'vue-toastification'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import Table from '@/views/components/Table/Table.vue'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import TableMessage from '@/views/components/Table/TableMessage.vue'
import { computed, reactive, ref } from 'vue'
import ModalDialog from '@/views/components/ModalDialog.vue'
import PersistentVolumeRow from '@/views/partials/PersistentVolumeRow.vue'
import PersistentVolumeBackups from '@/views/partials/PersistentVolumeBackups.vue'
import PersistentVolumeRestores from '@/views/partials/PersistentVolumeRestores.vue'
import { getHttpBaseUrl } from '@/vendor/utils.js'
import axios from 'axios'
import { useAuthStore } from '@/store/auth.js'

const toast = useToast()
const authStore = useAuthStore()
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

// Backup drawer
const selectedPersistentVolumeId = ref(-1)
const selectedPersistentVolumeName = ref('')
const isBackupDrawerOpen = ref(false)
const closeBackupDrawer = () => (isBackupDrawerOpen.value = false)
const openBackupDrawerForVolume = (id, name) => {
  selectedPersistentVolumeId.value = id
  selectedPersistentVolumeName.value = name
  isBackupDrawerOpen.value = true
}

// Restore drawer
const isRestoreDrawerOpen = ref(false)
const closeRestoreDrawer = () => (isRestoreDrawerOpen.value = false)
const openRestoreDrawerForVolume = (id, name) => {
  selectedPersistentVolumeId.value = id
  selectedPersistentVolumeName.value = name
  isRestoreDrawerOpen.value = true
}

// Restore now
const isRestoreNowModalOpen = ref(false)
const closeRestoreNowModal = () => (isRestoreNowModalOpen.value = false)
const openRestoreNowModal = (id, name) => {
  restoreFileFieldRef.value = null
  selectedPersistentVolumeId.value = id
  selectedPersistentVolumeName.value = name
  isRestoreNowModalOpen.value = true
}

const restoreFileFieldRef = ref(null)
const isRestoreNowButtonDisabled = computed(() => {
  return !restoreFileFieldRef.value?.files?.length
})
const isRestoreNowButtonLoading = ref(false)
const uploadPercentage = ref(0)
const uploadAndRestoreNow = () => {
  isRestoreNowButtonLoading.value = true
  const file = restoreFileFieldRef.value.files[0]
  const formData = new FormData()
  formData.append('file', file)
  const url = getHttpBaseUrl() + `/persistent-volume/${selectedPersistentVolumeId.value}/restore`
  axios
    .post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: authStore.FetchBearerToken()
      },
      onUploadProgress: (progressEvent) => {
        uploadPercentage.value = Math.round((progressEvent.loaded / progressEvent.total) * 100)
      }
    })
    .then((e) => {
      const data = e.data
      console.log(data)
      isRestoreNowButtonLoading.value = false
      toast.success('Restore initiated successfully')
      closeRestoreNowModal()
    })
    .catch((err) => {
      toast.error(err.message)
      isRestoreNowButtonLoading.value = false
    })
}
</script>

<template>
  <section class="mx-auto w-full max-w-7xl">
    <!-- Drawer for persistent volume backups -->
    <PersistentVolumeBackups
      :is-drawer-open="isBackupDrawerOpen"
      :close-drawer="closeBackupDrawer"
      :persistent-volume-id="selectedPersistentVolumeId"
      :persistent-volume-name="selectedPersistentVolumeName" />
    <!-- Drawer for persistent volume restores -->
    <PersistentVolumeRestores
      :is-drawer-open="isRestoreDrawerOpen"
      :close-drawer="closeRestoreDrawer"
      :persistent-volume-id="selectedPersistentVolumeId"
      :persistent-volume-name="selectedPersistentVolumeName" />
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

    <!--    Modal for create restore -->
    <ModalDialog :close-modal="closeRestoreNowModal" :is-open="isRestoreNowModalOpen" non-cancelable>
      <template v-slot:header>Restore `{{ selectedPersistentVolumeName }}` volume</template>
      <template v-slot:body>
        Choose the backup file (*.tar.gz) to restore the volume.
        <div class="">
          <label class="block text-sm font-medium text-gray-900 dark:text-white" for="source_code"
            >Select Restore File</label
          >
          <div class="mx-auto max-w-md space-y-8">
            <input
              @change="(e) => (restoreFileFieldRef = e.target)"
              class="w-full cursor-pointer rounded-md bg-gray-100 text-sm text-black file:mr-4 file:cursor-pointer file:border-0 file:bg-gray-800 file:px-4 file:py-2 file:text-white file:hover:bg-gray-700 focus:outline-none"
              accept=".tar.gz"
              type="file" />
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="flex w-full flex-col space-y-2">
          <FilledButton
            class="w-full"
            type="primary"
            :disabled="isRestoreNowButtonDisabled"
            :loading="isRestoreNowButtonLoading"
            :click="uploadAndRestoreNow"
            >Upload & Restore Now
            <span v-if="isRestoreNowButtonLoading" class="ml-2">{{ uploadPercentage }}%</span>
          </FilledButton>
          <FilledButton class="w-full" type="secondary" v-if="!isRestoreNowButtonLoading" :click="closeRestoreNowModal">
            Cancel
          </FilledButton>
        </div>
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
        <TableHeader align="left">ID</TableHeader>
        <TableHeader align="center">Volume Name</TableHeader>
        <TableHeader align="center">Size</TableHeader>
        <TableHeader align="center">PV Backup</TableHeader>
        <TableHeader align="center">PV Restore</TableHeader>
        <TableHeader align="right">Actions</TableHeader>
      </template>
      <template v-slot:message>
        <TableMessage v-if="persistentVolumes.length === 0">
          No persistent volumes found.<br />
          Click on the "Add New" button to create a new persistent volume.
        </TableMessage>
      </template>
      <template v-slot:body>
        <PersistentVolumeRow
          :delete-persistent-volume-with-confirmation="deletePersistentVolumeWithConfirmation"
          v-for="volume in persistentVolumes"
          :key="volume.id"
          :show-backups="() => openBackupDrawerForVolume(volume.id, volume.name)"
          :show-restores="() => openRestoreDrawerForVolume(volume.id, volume.name)"
          :restore-now="() => openRestoreNowModal(volume.id, volume.name)"
          :volume="volume" />
      </template>
    </Table>
  </section>
</template>

<style scoped></style>
