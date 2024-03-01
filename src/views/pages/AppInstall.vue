<!--suppress ALL -->
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, reactive, ref, shallowRef, toRaw } from 'vue'
import { parse } from 'yaml'
import { useToast } from 'vue-toastification'
import DotLoader from '@/views/components/DotLoader.vue'
import MarkdownRenderer from '@/views/components/MarkdownRenderer.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import ModalDialog from '@/views/components/ModalDialog.vue'
import PersistentVolumeSelector from '@/views/partials/PersistentVolumeSelector.vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const stackUrl = route.query.stack
const stackDetailsYamlString = shallowRef('')
const stackDetails = ref(null)
const isLoadingStack = ref(true)
const isInstallNowModalOpen = ref(false)
const formStateRef = reactive({
  STACK_NAME: ''
}) // will be filled with stack values
const deployedApplicationsResult = ref(null)

onMounted(() => {
  if (!stackUrl) {
    router.push({ name: 'App Store' })
  }
  fetchStackDetails()
})

const fetchStackDetails = async () => {
  if (!stackUrl) return
  fetch(stackUrl.toString())
    .then((response) => response.text())
    .then((data) => {
      stackDetailsYamlString.value = data
      stackDetails.value = parse(data)
      if ('services' in stackDetails.value && 'docs' in stackDetails.value) {
        // check if `iframe_video_embed` have any `<script` tag
        if (stackDetails.value.docs.iframe_video_embed.includes('<script')) {
          throw new Error('Invalid stack file')
        }
        setForm()
      } else {
        throw new Error('Invalid stack file')
      }
    })
    .catch((error) => {
      console.error(error)
      toast.error('Invalid stack file')
      router.push({ name: 'App Store' })
    })
}

const setForm = () => {
  let variables = stackDetails.value?.docs?.variables ?? {}
  formStateRef.STACK_NAME = ''
  for (const [key, value] of Object.entries(variables)) {
    formStateRef[key] = value.default
  }
  isLoadingStack.value = false
}

const isFormFilled = computed(() => {
  let variables = toRaw(formStateRef)
  for (const [key, value] of Object.entries(variables)) {
    if (!formStateRef[key]) {
      return false
    }
  }
  return true
})

const openInstallNowModal = () => {
  isInstallNowModalOpen.value = true
}
const closeModal = () => {
  if (confirm('Are you sure you want to cancel?')) {
    isInstallNowModalOpen.value = false
    setForm()
  }
}

const {
  mutate: deployStack,
  loading: deployStackLoading,
  onDone: onDeployStackDone,
  onError: onDeployStackError
} = useMutation(gql`
  mutation DeployStack($input: StackInput!) {
    deployStack(input: $input) {
      success
      message
      application {
        id
        name
      }
    }
  }
`)

onDeployStackDone((res) => {
  if (!res?.data?.deployStack) return
  deployedApplicationsResult.value = res?.data?.deployStack ?? []
  isInstallNowModalOpen.value = false
  isResultModalOpen.value = true
})

onDeployStackError((err) => {
  toast.error(err.message)
})

const deployStackHelper = () => {
  let variablesForSubmission = []
  const stateRef = toRaw(formStateRef)
  for (const [key, value] of Object.entries(stateRef)) {
    variablesForSubmission.push({
      name: key,
      value: stateRef[key]
    })
  }
  deployStack({
    input: {
      content: stackDetailsYamlString.value,
      variables: variablesForSubmission
    }
  })
}

// Result modal
const isResultModalOpen = ref(false)
const closeResultModal = () => {
  isResultModalOpen.value = false
  setForm()
}

const openUrlInNewPage = (url) => {
  window.open(url)
}
</script>

<template>
  <div v-if="isLoadingStack" class="flex h-full w-full items-center justify-center">
    <DotLoader />
  </div>
  <section v-else class="relative mx-auto mt-2 flex h-full w-full max-w-7xl flex-col items-center overflow-hidden">
    <!--  Header  -->
    <div class="flex w-full flex-row gap-5">
      <!--      Logo -->
      <div class="h-14 w-14 rounded-md border border-primary-500 p-1.5">
        <img :src="stackDetails.docs.logo_url" class="h-full w-full" :alt="stackDetails.docs.name" />
      </div>
      <!--    Title and description    -->
      <div>
        <p class="text-xl font-semibold">{{ stackDetails.docs.name }}</p>
        <p class="text-gray-800">{{ stackDetails.docs.description }}</p>
      </div>
    </div>
    <!--  Iframe Video  -->
    <div class="mt-12" v-if="stackDetails.docs.iframe_video_embed" v-html="stackDetails.docs.iframe_video_embed"></div>
    <!--  Readme description  -->
    <div class="mt-12 w-full" v-if="stackDetails.docs.readme_description">
      <MarkdownRenderer :source="stackDetails.docs.readme_description" />
    </div>
    <div v-else class="mt-12 w-full">
      <p class="italic text-gray-800">No details available</p>
    </div>
    <!--  Installation Options  -->
    <div class="absolute bottom-0 right-0">
      <div class="flex flex-row items-center justify-center gap-2">
        <p class="font-semibold text-secondary-700">Looking for installation ?</p>
        <FilledButton type="info" :click="openInstallNowModal">
          <font-awesome-icon icon="fa-solid fa-plus" class="mr-2" />
          Install Now
        </FilledButton>
      </div>
    </div>
  </section>
  <!--  Modal to create -->
  <ModalDialog :is-open="isInstallNowModalOpen && !isLoadingStack" non-cancelable width="2xl">
    <template v-slot:header>Install {{ stackDetails.docs.name }}</template>
    <template v-slot:body>
      Fill all the required information
      <div class="mt-4 flex w-full select-none flex-col gap-3">
        <div>
          <label class="block text-base font-medium text-gray-700">
            <p>Application Name <span class="text-red-600"> *</span></p>
            <p class="text-sm font-normal">Provide a name for your application</p>
          </label>
          <div class="mt-1">
            <input
              v-model="formStateRef.STACK_NAME"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              type="text"
              placeholder="Anything you like . . ." />
          </div>
        </div>
        <div v-for="key in Object.keys(stackDetails.docs.variables)">
          <label class="block text-base font-medium text-gray-700">
            <p>{{ stackDetails.docs.variables[key].title }} <span class="text-red-600"> *</span></p>
            <p class="text-sm font-normal">{{ stackDetails.docs.variables[key].description }}</p>
          </label>
          <div class="mt-1">
            <input
              v-if="stackDetails.docs.variables[key].type === 'text'"
              v-model="formStateRef[key]"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              type="text" />
            <select
              v-if="stackDetails.docs.variables[key].type === 'options'"
              v-model="formStateRef[key]"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
              <option v-for="op in stackDetails.docs.variables[key].options" :key="op.value" :value="op.value">
                {{ op.title }}
              </option>
            </select>
            <PersistentVolumeSelector
              v-if="stackDetails.docs.variables[key].type === 'volume'"
              :on-select="(volume) => (formStateRef[key] = volume)"
              selector="name"
              show-create-link />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="mt-4 flex w-full flex-row gap-2">
        <FilledButton class="w-full" type="danger" :click="closeModal" :disabled="deployStackLoading"
          >Cancel
        </FilledButton>
        <FilledButton
          class="w-full"
          type="primary"
          :loading="deployStackLoading"
          :disabled="!isFormFilled"
          :click="deployStackHelper"
          >Install Now
        </FilledButton>
      </div>
    </template>
  </ModalDialog>

  <!--  Modal to show result    -->
  <ModalDialog :is-open="isResultModalOpen" :close-modal="closeResultModal">
    <template v-slot:header>🎉 Deployed Successfully</template>
    <template v-slot:body>
      <div class="flex flex-col space-y-3 pt-3">
        <div
          class="flex items-center space-x-2"
          v-for="result in deployedApplicationsResult"
          :key="result.application.id">
          <font-awesome-icon v-if="result.success" icon="fa-solid fa-circle-check" class="text-base text-success-500" />
          <font-awesome-icon v-else icon="fa-solid fa-circle-xmark" class="text-base text-danger-500" />
          <p>
            {{ result.application?.name ?? 'N/A' }}
            <span v-if="result.message !== '' && !result.success"> - {{ result.message }}</span>
          </p>
          <FilledButton
            v-if="result.success"
            type="primary"
            slim
            :click="
              () =>
                openUrlInNewPage(
                  $router.resolve({
                    name: 'Application Details Deployments',
                    params: { id: result.application.id }
                  }).href
                )
            ">
            View
          </FilledButton>
        </div>
        <div v-if="deployedApplicationsResult.length === 0" class="text-center text-gray-500">
          No applications deployed
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <FilledButton type="warning" class="w-full" :click="() => $router.replace('/applications')"
        >Go to Applications List
      </FilledButton>
    </template>
  </ModalDialog>
</template>

<style scoped></style>
