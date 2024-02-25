<script setup>
import ModalDialog from '@/views/components/ModalDialog.vue'
import { reactive, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useToast } from 'vue-toastification'
import FilledButton from '@/views/components/FilledButton.vue'
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
const openModal = () => {
  newGitCredential.name = ''
  newGitCredential.username = ''
  newGitCredential.password = ''
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
  props.callbackOnPop()
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
  toast.success('Git Credential created successfully')
  props.callbackOnCreate()
})

onGitCredentialCreateFail((err) => {
  toast.error(err.message)
})

defineExpose({
  openModal,
  closeModal
})
</script>

<template>
  <teleport to="body">
    <ModalDialog :close-modal="closeModal" :is-open="isModalOpen">
      <template v-slot:header>Add Git Credential</template>
      <template v-slot:body>
        Enter the necessary information for configuring the new Git Credential.
        <form @submit.prevent="">
          <!--  Name Field   -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700" for="name">
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
            <label class="block text-sm font-medium text-gray-700" for="username"> Git Username </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="newGitCredential.username"
                @keydown="preventSpaceInput"
                autocomplete="off"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                name="username"
                placeholder="Git Username"
                type="text" />
            </div>
          </div>
          <!-- Password Field -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700" for="password"> Git Password </label>
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
        <FilledButton :click="createGitCredential" :loading="isGitCredentialCreating" type="primary"
          >Add Now
        </FilledButton>
      </template>
    </ModalDialog>
  </teleport>
</template>

<style scoped></style>
