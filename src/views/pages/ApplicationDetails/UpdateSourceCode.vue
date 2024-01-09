<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth.js'
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useToast } from 'vue-toastification'
import FilledButton from '@/views/components/FilledButton.vue'
import { generateTarBlob } from '@/vendor/tarts.js'
import DockerfileEditor from '@/views/partials/DeployApplication/DockerfileEditor.vue'
import BuildArgInput from '@/views/partials/BuildArgInput.vue'
import {
  getGitProvideFromGitRepoUrl,
  getGitRepoNameFromGitRepoUrl,
  getGitRepoOwnerFromGitRepoUrl
} from '@/vendor/utils.js'
import newApplicationUpdater from '@/store/applicationUpdater.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const applicationUpdater = newApplicationUpdater(router.currentRoute.value.params.id)()


const applicationSourceType = computed(() => {
  if (applicationExistingDetailsResult.value) {
    return applicationExistingDetailsResult.value?.application?.latestDeployment?.upstreamType??""
  } else {
    return null
  }
})
const sourceCodeCompressedFileFieldRef = ref(null)
const stateRef = reactive({
  sourceCodeCompressedFileName: '',
  gitCredentialId: 0,
  gitRepoUrl: '',
  gitBranch: '',
  imageRegistryCredentialId: 0,
  dockerImage: '',
  isUploadingSourceCode: false,
  detectedServiceName: '',
  dockerFile: '',
  dockerBuildArgs: [],
  buildArgs: {},
  isDockerFileEditorOpen: false,
  isDockerConfigurationGenerated: false
})

watch(stateRef, () => {
  applicationUpdater.updateApplicationSource(stateRef)
}, {deep: true})


watch(()=>applicationUpdater.isConfigurationUpdated, (updateStatus) => {
  if(updateStatus === false){
    prefillDetails()
  }
})

const applicationExistingDetailsResult = computed(() => {
  return applicationUpdater.applicationExistingDetailsResult??{}
})

function prefillDetails(){
  if(applicationExistingDetailsResult.value && applicationExistingDetailsResult.value.application) {
    stateRef.gitRepoUrl = applicationExistingDetailsResult.value.application.latestDeployment.gitProvider + '.com/' +
      applicationExistingDetailsResult.value.application.latestDeployment.repositoryOwner + '/' +
      applicationExistingDetailsResult.value.application.latestDeployment.repositoryName;
    stateRef.gitBranch = applicationExistingDetailsResult.value.application.latestDeployment.repositoryBranch;
    stateRef.gitCredentialId = applicationExistingDetailsResult.value.application.latestDeployment.gitCredentialID;
    stateRef.isDockerConfigurationGenerated = true;
    stateRef.detectedServiceName = "Taken from existing deployment";
    stateRef.dockerFile = applicationExistingDetailsResult.value.application.latestDeployment.dockerfile;
    const buildArgs = applicationExistingDetailsResult.value.application.latestDeployment.buildArgs;
    stateRef.buildArgs = {};
    stateRef.dockerBuildArgs = [];
    for (const buildArg of buildArgs) {
      stateRef.buildArgs[buildArg.key] = buildArg.value
      stateRef.dockerBuildArgs.push({
        key: buildArg.key,
        description: "",
        value: buildArg.value
      })
    }
    stateRef.sourceCodeCompressedFileName = applicationExistingDetailsResult.value.application.latestDeployment.sourceCodeCompressedFileName;
    stateRef.dockerImage = applicationExistingDetailsResult.value.application.latestDeployment.dockerImage;
    stateRef.imageRegistryCredentialId = applicationExistingDetailsResult.value.application.latestDeployment.imageRegistryCredentialID;
  }
}

watch(applicationExistingDetailsResult, ()=>{
  prefillDetails()
})

onMounted(()=> {
  prefillDetails()
})

const openDockerFileEditor = () => {
  stateRef.isDockerFileEditorOpen = true
}

const closeDockerFileEditor = () => {
  stateRef.isDockerFileEditorOpen = false
}

const enableGenerateConfigurationButton = computed(() => {
  if (applicationSourceType.value === 'git') {
    return stateRef.gitRepoUrl !== '' && stateRef.gitBranch !== ''
  } else if (applicationSourceType.value === 'sourceCode') {
    return stateRef.sourceCodeCompressedFileName !== ''
  } else if (applicationSourceType.value === 'image') {
    return stateRef.dockerImage !== ''
  } else {
    return false
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


const HTTP_BASE_URL = import.meta.env.VITE_HTTP_BASE_URL
async function uploadTarFile(fileblob) {
  try {
    var data = new FormData()
    data.append('file', fileblob, 'file.tar')
    const res = await axios({
      method: 'post',
      url: `${HTTP_BASE_URL}/upload/code`,
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
    const file = await generateTarBlob(sourceCodeCompressedFileFieldRef.value.files)
    const res = await uploadTarFile(file)
    if (res.success) {
      stateRef.sourceCodeCompressedFileName = res.file
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
  load: generateConfigurationLoad,
  refetch: generateConfigurationRefetch,
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
          defaultValue
        }
      }
    }
  `,
  {
    input: {}
  },
  {
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache'
  }
)

onGenerateConfigurationError((err) => toast.error(err.message))

onGenerateConfigurationSuccess((res) => {
  if (res.data && res.data.dockerConfigGenerator) {
    stateRef.detectedServiceName = res.data.dockerConfigGenerator.detectedServiceName
    stateRef.dockerFile = res.data.dockerConfigGenerator.dockerFile
    stateRef.dockerBuildArgs = res.data.dockerConfigGenerator.dockerBuildArgs
    // set default build args if not set
    for (const buildArg of stateRef.dockerBuildArgs) {
      stateRef.buildArgs[buildArg.key] = buildArg.defaultValue
    }
    // delete build args if not present in dockerBuildArgs
    for (const buildArgKey in stateRef.buildArgs) {
      if (!stateRef.dockerBuildArgs.some((buildArg) => buildArg.key === buildArgKey)) {
        delete stateRef.buildArgs[buildArgKey]
      }
    }
    stateRef.isDockerConfigurationGenerated = true
    closeDockerFileEditor()
  }
})

const updateBuildArg = (key, value) => {
  stateRef.buildArgs[key] = value
}

const generateConfiguration = () => {
  if (applicationSourceType.value === 'image') {
    stateRef.detectedServiceName = "😅 You don't need configuration for docker image"
    stateRef.isDockerConfigurationGenerated = true
  } else {
    stateRef.gitRepoUrl = stateRef.gitRepoUrl.trim().replace('https://', '').replace('http://', '')
    let gitCredentialId = parseInt(stateRef.gitCredentialId.toString())
    generateConfigurationVariables.value.input = {
      sourceType: applicationSourceType.value,
      gitCredentialID: gitCredentialId === 0 ? null : gitCredentialId,
      gitProvider: getGitProvideFromGitRepoUrl(stateRef.gitRepoUrl),
      repositoryBranch: stateRef.gitBranch === '' ? null : stateRef.gitBranch,
      repositoryName: getGitRepoNameFromGitRepoUrl(stateRef.gitRepoUrl),
      repositoryOwner: getGitRepoOwnerFromGitRepoUrl(stateRef.gitRepoUrl),
      customDockerFile: '',
      sourceCodeCompressedFileName: stateRef.sourceCodeCompressedFileName === '' ? null : stateRef.sourceCodeCompressedFileName
    }
    if (generateConfigurationLoad() === false) {
      generateConfigurationRefetch()
    }
  }
}

const generateConfigurationForCustomDockerFile = (customDockerFile) => {
  generateConfigurationVariables.value.input = {
    sourceType: 'custom',
    gitCredentialID: null,
    gitProvider: null,
    repositoryBranch: null,
    repositoryName: null,
    repositoryOwner: null,
    customDockerFile: customDockerFile,
    sourceCodeCompressedFileName: null
  }
  if (generateConfigurationLoad() === false) {
    generateConfigurationRefetch()
  }
}
</script>

<template>
  <div :key="2" class="mt-5 flex w-full flex-row justify-evenly p-6 mb-5">
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
              ref="sourceCodeCompressedFileFieldRef"
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

    <div v-if="stateRef.isDockerConfigurationGenerated" class="w-1/2 max-w-md">
      <p class="text-xl font-medium">Generated Configuration</p>
      <p class="mt-6 font-medium text-gray-700">
        🏂 Detected Service Name -
        <span class="font-normal text-primary-600">{{ stateRef.detectedServiceName }}</span>
      </p>
      <FilledButton v-if="applicationSourceType !== 'image'" class="mt-4 w-full" @click="openDockerFileEditor"
      >View / Modify Dockerfile
      </FilledButton>
      <div v-if="stateRef.dockerBuildArgs.length !== 0">
        <p class="mt-6 font-medium text-gray-700">🐳 Docker Build Args</p>
        <div class="w-full">
          <BuildArgInput
            v-for="buildArg in stateRef.dockerBuildArgs"
            :key="buildArg.key"
            :arg-key="buildArg.key"
            :description="buildArg.description"
            :update-build-arg="(val) => updateBuildArg(buildArg.key, val)"
            :value="stateRef.buildArgs[buildArg.key]" />
        </div>
      </div>
    </div>

    <!-- Dockerfile Editor -->
    <DockerfileEditor
      :close-modal="closeDockerFileEditor"
      :code="stateRef.dockerFile"
      :docker-configuration-generating="dockerConfigGeneratorGenerating"
      :is-open="stateRef.isDockerFileEditorOpen"
      :submit="generateConfigurationForCustomDockerFile" />
  </div>
</template>

<style scoped></style>
