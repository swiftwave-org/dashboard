<script setup>
import FilledButton from '@/views/components/FilledButton.vue'
import ModalDialog from '@/views/components/ModalDialog.vue'
import { reactive, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useToast } from 'vue-toastification'
import { preventSpaceInput } from '@/vendor/utils.js'

const props = defineProps({
  callbackOnCreate: {
    type: Function,
    required: false,
    default: () => {}
  },
  callbackOnPop: {
    type: Function,
    required: false,
    default: () => {}
  }
})

const toast = useToast()

const isModalOpen = ref(false)
// Create persistent volume
const newPersistentVolumeDetails = reactive({
  name: '',
  type: 'local',
  nfsConfig: {
    host: '',
    path: '',
    version: 4
  }
})

const openModal = () => {
  newPersistentVolumeDetails.name = ''
  newPersistentVolumeDetails.type = 'local'
  newPersistentVolumeDetails.nfsConfig.host = ''
  newPersistentVolumeDetails.nfsConfig.path = ''
  newPersistentVolumeDetails.nfsConfig.version = 4
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
  props.callbackOnPop()
}

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
  props.callbackOnCreate()
})

onDomainRegisterFail((err) => {
  toast.error(err.message)
})

defineExpose({
  openModal,
  closeModal
})
</script>

<template>
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
              @keydown="preventSpaceInput"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              name="name"
              placeholder="Name of persistent volume"
              type="text" />
          </div>
        </div>
        <!--    Type Field      -->
        <div class="mt-2">
          <label class="block text-sm font-medium text-gray-700">Type</label>
          <select
            v-model="newPersistentVolumeDetails.type"
            class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
            <option value="local">Local</option>
            <option value="nfs">NFS</option>
          </select>
        </div>
        <!--   NFS Server Host    -->
        <div class="mt-2" v-if="newPersistentVolumeDetails.type === 'nfs'">
          <label class="block text-sm font-medium text-gray-700">NFS Server Host</label>
          <div class="mt-1">
            <input
              v-model="newPersistentVolumeDetails.nfsConfig.host"
              autocomplete="off"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="NFS Server Host"
              type="text" />
          </div>
          <p class="mt-2 text-sm text-gray-500">
            Example:
            <span class="text-gray-700"> nfs-server.example.com </span>
          </p>
        </div>
        <!--    NFS Share Path      -->
        <div class="mt-2" v-if="newPersistentVolumeDetails.type === 'nfs'">
          <label class="block text-sm font-medium text-gray-700">NFS Share Path</label>
          <div class="mt-1">
            <input
              v-model="newPersistentVolumeDetails.nfsConfig.path"
              autocomplete="off"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="NFS Share Path"
              type="text" />
          </div>
          <p class="mt-2 text-sm text-gray-500">
            Example:
            <span class="text-gray-700"> /mnt/nfs_share </span>
          </p>
        </div>
        <!--  Version -->
        <div class="mt-2" v-if="newPersistentVolumeDetails.type === 'nfs'">
          <label class="block text-sm font-medium text-gray-700">NFS Version</label>
          <select
            v-model="newPersistentVolumeDetails.nfsConfig.version"
            class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
            <option value="4">NFS v4</option>
            <option value="3">NFS v3</option>
            <option value="2">NFS v2</option>
          </select>
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <FilledButton :click="registerPersistentVolume" :loading="isDomainRegistering" type="primary"
        >Register
      </FilledButton>
    </template>
  </ModalDialog>
</template>

<style scoped></style>
