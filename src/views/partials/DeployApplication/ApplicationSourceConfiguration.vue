<script setup>
import { computed, reactive, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth.js'
import { TabPanel } from '@headlessui/vue'
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useToast } from 'vue-toastification'
import FilledButton from '@/views/components/FilledButton.vue'
import { generateTarBlob } from '@/vendor/tarts.js'

const props = defineProps({
  applicationSourceType: {
    type: String,
    required: true
  }
})

const authStore = useAuthStore()
const toast = useToast()

const sourceCodeFileFieldRef = ref(null)
const stateRef = reactive({
  sourceCodeFile: '',
  gitCredentialId: 0,
  gitRepoUrl: '',
  gitBranch: '',
  imageRegistryCredentialId: 0,
  dockerImage: '',
  isUploadingSourceCode: false,
  detectedServiceName: '',
  dockerFile: '',
  dockerBuildArgs: []
})

const enableGenerateConfigurationButton = computed(() => {
  if (props.applicationSourceType === 'git') {
    return stateRef.gitRepoUrl !== '' && stateRef.gitBranch !== ''
  } else if (props.applicationSourceType === 'sourceCode') {
    return stateRef.sourceCodeFile !== ''
  } else if (props.applicationSourceType === 'image') {
    return stateRef.dockerImage !== ''
  }
})

// List Image Registry Credentials query
const { result: imageRegistryCredentialList, onError: onImageRegistryCredentialListError } = useQuery(
  gql`
    query {
      imageRegistryCredentials {
        id
        url
        username
      }
    }
  `,
  null,
  {
    pollInterval: 10000
  }
)
const imageRegistryCredentials = computed(() => imageRegistryCredentialList.value?.imageRegistryCredentials ?? [])

onImageRegistryCredentialListError((err) => toast.error(err.message))
// Fetch git credentials
const { result: gitCredentialList, onError: onGitCredentialListError } = useQuery(
  gql`
    query {
      gitCredentials {
        id
        name
      }
    }
  `,
  null,
  {
    pollInterval: 10000
  }
)
const gitCredentials = computed(() => gitCredentialList.value?.gitCredentials ?? [])

onGitCredentialListError((err) => toast.error(err.message))

async function uploadTarFile(fileblob) {
  try {
    var data = new FormData()
    data.append('file', fileblob, 'file.tar')
    const res = await axios({
      method: 'post',
      url: 'https://ip-3-7-45-250.swiftwave.xyz:3333/upload/code',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: authStore.FetchBearerToken()
      },
      data: data
    })
    return {
      success: true,
      message: res.data.message,
      file: res.data.file
    }
  } catch (error) {
    return {
      success: false,
      message: error.response.data.message,
      file: null
    }
  }
}

const uploadSourceCode = async () => {
  stateRef.isUploadingSourceCode = true
  try {
    const file = await generateTarBlob(sourceCodeFileFieldRef.value.files)
    const res = await uploadTarFile(file)
    if (res.success) {
      stateRef.sourceCodeFile = res.file
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
  } catch (e) {
    toast.error('failed to upload source code')
  }
  stateRef.isUploadingSourceCode = false
}

// Generate Configuration
const {
  result: generateConfigurationResult,
  load: generateConfigurationLoad,
  loading: dockerConfigGeneratorGenerating,
  onError: onGenerateConfigurationError,
  onResult: onGenerateConfigurationSuccess,
  variables: generateConfigurationVariables
} = useLazyQuery(
  gql`
    query ($input: DockerConfigGeneratorInput!) {
      dockerConfigGenerator(input: $input) {
        detectedServiceName
        dockerFile
        dockerBuildArgs {
          key
          description
          type
          defaultValue
        }
      }
    }
  `,
  {
    input: {}
  }
)

onGenerateConfigurationSuccess((res) => {
  if (res.data.dockerConfigGenerator) {
    stateRef.detectedServiceName = res.data.dockerConfigGenerator.detectedServiceName
    stateRef.dockerFile = res.data.dockerConfigGenerator.dockerFile
    stateRef.dockerBuildArgs = res.data.dockerConfigGenerator.dockerBuildArgs
  }
})

const generateConfiguration = () => {
  stateRef.gitRepoUrl = stateRef.gitRepoUrl.trim().replace('https://', '').replace('http://', '')
  let gitCredentialId = parseInt(stateRef.gitCredentialId.toString())
  generateConfigurationVariables.value.input = {
    sourceType: props.applicationSourceType,
    gitCredentialID: gitCredentialId === 0 ? null : gitCredentialId,
    gitProvider: getGitProvideFromGitRepoUrl(stateRef.gitRepoUrl),
    repositoryBranch: stateRef.gitBranch,
    repositoryName: getGitRepoNameFromGitRepoUrl(stateRef.gitRepoUrl),
    repositoryOwner: getGitRepoOwnerFromGitRepoUrl(stateRef.gitRepoUrl),
    customDockerFile: '',
    sourceCodeCompressedFileName: stateRef.sourceCodeFile
  }
  generateConfigurationLoad()
}

// utils
const getGitProvideFromGitRepoUrl = (gitRepoUrl) => {
  if (gitRepoUrl.includes('github')) {
    return 'github'
  } else if (gitRepoUrl.includes('gitlab')) {
    return 'gitlab'
  } else {
    return null
  }
}

const getGitRepoOwnerFromGitRepoUrl = (gitRepoUrl) => {
  const gitRepoUrlParts = gitRepoUrl.split('/')
  if (gitRepoUrlParts.length < 2) {
    return null
  }
  return gitRepoUrlParts[gitRepoUrlParts.length - 2]
}

const getGitRepoNameFromGitRepoUrl = (gitRepoUrl) => {
  const gitRepoUrlParts = gitRepoUrl.split('/')
  if (gitRepoUrlParts.length < 2) {
    return null
  }
  return gitRepoUrlParts[gitRepoUrlParts.length - 1]
}
</script>

<template>
  <TabPanel :key="2" class="mt-5 flex h-full w-full flex-row justify-evenly p-6">
    <div class="w-1/2 max-w-md">
      <!--  Git as Source  -->
      <div v-if="applicationSourceType === 'git'" class="w-full">
        <p class="text-xl font-medium">Git Repository Information</p>
        <!-- Git Repository URL -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700" for="git_repo_url">Git Repository URL</label>
          <div class="mt-1">
            <input
              id="git_repo_url"
              v-model="stateRef.gitRepoUrl"
              autocomplete="off"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              name="name"
              placeholder="Enter Git Repository URL"
              type="text" />

            <p class="mt-1 text-xs text-gray-800">* Only GitHub & GitLab supported</p>
          </div>
        </div>

        <!-- Git Branch -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700" for="name">Git Branch</label>
          <div class="mt-1">
            <input
              id="name"
              v-model="stateRef.gitBranch"
              autocomplete="off"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              name="name"
              placeholder="Name of branch"
              type="text" />
          </div>
        </div>

        <!-- Git Credentials -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700" for="git_credential">Pick Git Credential</label>
          <div class="mt-1">
            <select
              id="git_credential"
              v-model="stateRef.gitCredentialId"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
              <option disabled selected value="0">Select a credential</option>
              <option v-for="credential in gitCredentials" :key="credential.id" :value="credential.id">
                {{ credential.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!--  File upload source  -->
      <div v-else-if="applicationSourceType === 'sourceCode'" class="w-full">
        <p class="text-xl font-medium">Upload Source Code</p>
        <!--    Source Code -->
        <div class="mt-4">
          <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white" for="source_code"
            >Select Folder</label
          >
          <div class="mx-auto max-w-md space-y-8">
            <input
              ref="sourceCodeFileFieldRef"
              class="w-full cursor-pointer rounded-md bg-gray-100 text-sm text-black file:mr-4 file:cursor-pointer file:border-0 file:bg-gray-800 file:px-4 file:py-2 file:text-white file:hover:bg-gray-700 focus:outline-none"
              directory
              multiple
              type="file"
              webkitdirectory />
          </div>
        </div>

        <!-- Upload Code -->
        <FilledButton
          :loading="stateRef.isUploadingSourceCode"
          class="mt-4 w-full"
          type="secondary"
          @click="uploadSourceCode"
          >Upload Code
        </FilledButton>
      </div>
      <!--  Docker Source  -->
      <div v-else-if="applicationSourceType === 'image'" class="w-full">
        <!-- Docker Image URL-->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700" for="docker_image"
            >Docker Image <span class="text-red-600"> *</span>
          </label>
          <div class="mt-1">
            <input
              id="docker_image"
              v-model="stateRef.dockerImage"
              autocomplete="off"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              name="name"
              placeholder="Enter Docker Image URL"
              type="text" />
          </div>
        </div>
        <!-- Image Registry Credentials -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700" for="image_registry_credential"
            >Pick Image Registry Credential (Optional)
          </label>
          <div class="mt-1">
            <select
              id="image_registry_credential"
              v-model="stateRef.imageRegistryCredentialId"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
              <option selected value="0">Select a credential</option>
              <option v-for="credential in imageRegistryCredentials" :key="credential.id" :value="credential.id">
                {{ credential.username }} - {{ credential.url }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <FilledButton
        :disabled="!enableGenerateConfigurationButton"
        :loading="dockerConfigGeneratorGenerating"
        class="mt-6 w-full"
        type="primary"
        @click="generateConfiguration"
        >Generate Configuration
      </FilledButton>
    </div>

    <!-- just for padding purpose -->
    <div></div>

    <div class="w-1/2 max-w-md">
      <p class="text-xl font-medium">Generated Configuration</p>
      <p class="mt-3 font-medium">
        🏂 Detected Service Name -
        <span class="font-bold uppercase text-primary-600">{{ stateRef.detectedServiceName }}</span>
      </p>
      <FilledButton class="mt-4 w-full">View / Modify Dockerfile</FilledButton>
    </div>
  </TabPanel>
</template>

<style scoped></style>
