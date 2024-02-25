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

const openModal = () => {
  newDomainDetails.name = ''
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
  props.callbackOnPop()
}

// Register Domain state
const newDomainDetails = reactive({
  name: ''
})

const {
  mutate: registerDomain,
  loading: isDomainRegistering,
  onDone: onDomainRegisterSuccess,
  onError: onDomainRegisterFail
} = useMutation(
  gql`
    mutation ($input: DomainInput!) {
      addDomain(input: $input) {
        id
        name
      }
    }
  `,
  {
    variables: {
      input: newDomainDetails
    }
  }
)

onDomainRegisterSuccess(() => {
  closeModal()
  newDomainDetails.name = ''
  toast.success('Domain registered successfully')
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
  <teleport to="body">
    <ModalDialog :close-modal="closeModal" :is-open="isModalOpen">
      <template v-slot:header>Register New Domain</template>
      <template v-slot:body>
        Enter the domain or subdomain name you want to register.
        <form @submit.prevent="">
          <!--  Name Field   -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700" for="name">
              Domain Name (example: example.com)
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="newDomainDetails.name"
                @keydown="preventSpaceInput"
                autocomplete="off"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                name="name"
                placeholder="example.com or test.example.com"
                type="text" />
            </div>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <FilledButton :click="registerDomain" :loading="isDomainRegistering" type="primary">Register</FilledButton>
      </template>
    </ModalDialog>
  </teleport>
</template>

<style scoped></style>
