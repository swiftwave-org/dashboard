<script setup>
import { reactive, ref } from 'vue'
import { Tab, TabGroup, TabList, TabPanels } from '@headlessui/vue'
import ApplicationNameSelection from '@/views/partials/DeployApplication/ApplicationNameSelection.vue'
import ApplicationSourceSelection from '@/views/partials/DeployApplication/ApplicationSourceSelection.vue'
import ApplicationSourceConfiguration from '@/views/partials/DeployApplication/ApplicationSourceConfiguration.vue'
import ApplicationAdditionalSettings from '@/views/partials/DeployApplication/ApplicationAdditionalSettings.vue'
import ApplicationDeployConfirmation from '@/views/partials/DeployApplication/ApplicationDeployConfirmation.vue'
import {
  getGitProvideFromGitRepoUrl,
  getGitRepoNameFromGitRepoUrl,
  getGitRepoOwnerFromGitRepoUrl
} from '@/vendor/utils.js'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()
const sectionNames = [
  'Application Name',
  'Select Source',
  'Configure Source',
  'Additional Settings',
  'Confirm and Deploy'
]

const selectedTabIndex = ref(0)

const changeTab = (index) => {
  selectedTabIndex.value = index
}

// state
const newApplicationState = reactive({
  name: '',
  upstreamType: '',
  deploymentMode: '',
  replicas: 0,
  dockerfile: '',
  buildArgs: [],
  environmentVariables: [],
  persistentVolumeBindings: [],
  gitCredentialID: 0,
  gitProvider: '',
  repositoryName: '',
  repositoryOwner: '',
  repositoryBranch: '',
  codePath: '',
  imageRegistryCredentialID: 0,
  dockerImage: '',
  sourceCodeCompressedFileName: '',
  capabilities: [],
  sysctls: []
})

// Deploy application
const {
  mutate: deployApplication,
  loading: isDeployRequestSubmitting,
  onDone: onDeployApplicationMutationDone,
  onError: onDeployApplicationMutationError
} = useMutation(
  gql`
    mutation ($input: ApplicationInput!) {
      createApplication(input: $input) {
        id
        name
        latestDeployment {
          id
        }
      }
    }
  `,
  {
    variables: {
      input: newApplicationState
    }
  }
)

onDeployApplicationMutationDone((result) => {
  toast.success('Application deployed successfully !')
  console.log(result)
  if(result.data.createApplication.latestDeployment === null) {
    toast.warning('Application is not deployed yet, please wait for a while and refresh the page')
    return
  }
  router.push({
    name: 'Deployment Details',
    params: {
      id: result.data.createApplication.latestDeployment.id
    }
  })
})

onDeployApplicationMutationError((msg) => {
  toast.error(msg)
})

// functions
const finalApplicationNameAndMoveToNextTab = (name) => {
  newApplicationState.name = name
  changeTab(1)
}

const finalizeApplicationSourceAndMoveToNextTab = (upstreamType) => {
  newApplicationState.upstreamType = upstreamType
  changeTab(2)
}

const finalizeApplicationSourceConfigurationAndMoveToNextTab = (configuration) => {
  // Store the configuration in the state
  // NOTE: Don't modify as configuration is a reference to the state of `ApplicationSourceConfiguration.vue`
  newApplicationState.dockerfile = configuration.dockerFile
  let buildArgs = []
  for (let key in configuration.buildArgs) {
    buildArgs.push({
      key: key,
      value: configuration.buildArgs[key]
    })
  }
  newApplicationState.buildArgs = buildArgs
  newApplicationState.gitCredentialID = parseInt(configuration.gitCredentialID)
  newApplicationState.imageRegistryCredentialID = parseInt(configuration.imageRegistryCredentialID)
  newApplicationState.gitCredentialID = configuration.gitCredentialID === 0 ? null : configuration.gitCredentialID
  newApplicationState.imageRegistryCredentialID = configuration.imageRegistryCredentialID === 0 ? null : configuration.imageRegistryCredentialID
  newApplicationState.gitProvider = getGitProvideFromGitRepoUrl(configuration.gitRepoUrl)
  newApplicationState.repositoryBranch = configuration.gitBranch
  newApplicationState.repositoryName = getGitRepoNameFromGitRepoUrl(configuration.gitRepoUrl)
  newApplicationState.repositoryOwner = getGitRepoOwnerFromGitRepoUrl(configuration.gitRepoUrl)
  newApplicationState.codePath = configuration.codePath
  newApplicationState.sourceCodeCompressedFileName = configuration.sourceCodeFile
  newApplicationState.dockerImage = configuration.dockerImage
  changeTab(3)
}

const finalizeApplicationAdditionalSettingsAndMoveToNextTab = (additionalSettings) => {
  // Store the configuration in the state
  // NOTE: Don't modify as configuration is a reference to the state of `ApplicationAdditionalSettings.vue`
  newApplicationState.deploymentMode = additionalSettings.deploymentMode
  newApplicationState.replicas = additionalSettings.replicas
  newApplicationState.environmentVariables = additionalSettings.environmentVariables
  newApplicationState.persistentVolumeBindings = additionalSettings.persistentVolumeBindings
  changeTab(4)
}
</script>

<template>
  <div class="flex h-full w-full max-w-7xl flex-col items-center sm:px-0">
    <TabGroup :selected-index="selectedTabIndex">
      <TabList class="flex w-full max-w-4xl space-x-3 rounded-full bg-primary-600 p-1">
        <Tab v-for="sectionName in sectionNames" :key="sectionName" v-slot="{ selected }" as="template">
          <button :class="selected ? 'tab-button-selected' : 'tab-button-unselected'" class="tab-button">
            {{ sectionName }}
          </button>
        </Tab>
      </TabList>

      <TabPanels class="mt-6 flex h-full w-full flex-col items-center">
        <!-- Application Name Selection -->
        <ApplicationNameSelection :final-application-name-and-move-to-next-tab="finalApplicationNameAndMoveToNextTab" />
        <!-- Source Selection -->
        <ApplicationSourceSelection
          :finalize-application-source-and-move-to-next-tab="finalizeApplicationSourceAndMoveToNextTab" />
        <!--  Source Configuration -->
        <ApplicationSourceConfiguration
          :application-source-type="newApplicationState.upstreamType"
          :finalize-application-source-configuration-and-move-to-next-tab="
            finalizeApplicationSourceConfigurationAndMoveToNextTab
          " />
        <!-- Additional Settings  -->
        <ApplicationAdditionalSettings
          :finalize-application-additional-settings-and-move-to-next-tab="
            finalizeApplicationAdditionalSettingsAndMoveToNextTab
          " />
        <!--  Deploy Confirmation  -->
        <ApplicationDeployConfirmation
          :deploy-application="deployApplication"
          :is-deploy-request-submitting="isDeployRequestSubmitting" />
      </TabPanels>
    </TabGroup>
  </div>
</template>

<style scoped>
.tab-button {
  @apply w-full rounded-full px-3 py-2 text-sm font-medium leading-5 focus:outline-none;
}

.tab-button-selected {
  @apply bg-gray-100 text-gray-900 shadow;
}

.tab-button-unselected {
  @apply text-gray-200 hover:bg-white/[0.1] hover:text-white;
}

.tab-panel {
  @apply mt-5;
}
</style>
