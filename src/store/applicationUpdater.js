import { defineStore } from 'pinia'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed, reactive, ref, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import {
  getGitProvideFromGitRepoUrl,
  getGitRepoNameFromGitRepoUrl,
  getGitRepoOwnerFromGitRepoUrl
} from '@/vendor/utils.js'
import { useRouter } from 'vue-router'

export default function newApplicationUpdater(applicationId) {
  const storeName = 'application_updater_' + applicationId
  return defineStore(storeName, () => {
    const router = useRouter()
    const isConfigurationUpdated = ref(false)
    const applyConfigurationChanges = () => {
      const appState = mergeChangesWithExistingApplicationDetails()
      appState.gitCredentialID = appState.gitCredentialId === 0 ? null : appState.gitCredentialId
      appState.imageRegistryCredentialID = appState.imageRegistryCredentialId === 0 ? null : appState.imageRegistryCredentialId
      deployApplication({
        input: appState,
        id: applicationId
      })
    }

    const cancelConfigurationChanges = () => {
      resetDetailsToApplicationDetails()
    }

    const {
      mutate: deployApplication,
      loading: isDeployRequestSubmitting,
      onDone: onDeployApplicationMutationDone,
      onError: onDeployApplicationMutationError
    } = useMutation(
      gql`
      mutation ($id: String!, $input: ApplicationInput!) {
        updateApplication(id: $id, input: $input) {
          id
          name
        }
      }
  `)

    onDeployApplicationMutationError((error) => {
      alert('Failed to update application\n' + error.message)
    })

    onDeployApplicationMutationDone(() => {
      refetchApplicationDetails()
      alert('Application updated successfully')
      router.push({ name: 'Application Details Deployments', params: { id: applicationId }})
    })


    const {
      result: applicationDetailsRaw,
      refetch: refetchApplicationDetails,
      loading: applicationDetailsLoading
    } = useQuery(gql`
      query ($id: String!) {
        application(id: $id) {
          deploymentMode
          replicas
          environmentVariables {
            key
            value
          }
          persistentVolumeBindings {
            persistentVolumeID
            mountingPath
          }
          latestDeployment {
            upstreamType
            dockerfile
            buildArgs {
              key
              value
            }
            gitProvider
            gitCredentialID
            repositoryName
            repositoryOwner
            repositoryBranch
            imageRegistryCredentialID
            dockerImage
            sourceCodeCompressedFileName
          }
        }
      }
    `, {
      id: applicationId
    })

    watch(applicationDetailsRaw, () => {
      resetDetailsToApplicationDetails()
    })

    const resetDetailsToApplicationDetails = () => {
      const environmentVariables = applicationDetailsRaw.value?.application?.environmentVariables ?? []
      let keys = []
      let map = {}
      environmentVariables.forEach((variable) => {
        const z = uuidv4()
        keys.push(z)
        map[z] = {
          name: variable.key,
          value: variable.value
        }
      })
      environmentVariableDetails.keys = keys
      environmentVariableDetails.map = map

      const persistentVolumeBindings = applicationDetailsRaw.value?.application?.persistentVolumeBindings ?? []
      keys = []
      map = {}
      persistentVolumeBindings.forEach((binding) => {
        const z = uuidv4()
        keys.push(z)
        map[z] = {
          persistentVolumeID: binding.persistentVolumeID,
          mountingPath: binding.mountingPath
        }
      })
      persistentVolumeBindingsDetails.keys = keys
      persistentVolumeBindingsDetails.map = map

      const deploymentConfiguration = applicationDetailsRaw.value?.application ?? {}
      deploymentConfigurationDetails.deploymentMode = deploymentConfiguration.deploymentMode
      deploymentConfigurationDetails.replicas = deploymentConfiguration.replicas

      sourceConfigurationRef.gitCredentialID = deploymentConfiguration.latestDeployment.gitCredentialID
      sourceConfigurationRef.gitProvider = deploymentConfiguration.latestDeployment.gitProvider
      sourceConfigurationRef.repositoryName = deploymentConfiguration.latestDeployment.repositoryName
      sourceConfigurationRef.repositoryOwner = deploymentConfiguration.latestDeployment.repositoryOwner
      sourceConfigurationRef.repositoryBranch = deploymentConfiguration.latestDeployment.repositoryBranch
      sourceConfigurationRef.imageRegistryCredentialID = deploymentConfiguration.latestDeployment.imageRegistryCredentialID
      sourceConfigurationRef.dockerImage = deploymentConfiguration.latestDeployment.dockerImage
      sourceConfigurationRef.sourceCodeCompressedFileName = deploymentConfiguration.latestDeployment.sourceCodeCompressedFileName
      sourceConfigurationRef.dockerfile = deploymentConfiguration.latestDeployment.dockerfile

      // reset isConfigurationUpdated
      isConfigurationUpdated.value = false
    }

    const environmentVariableDetails = reactive({
      keys: [],
      map: {}
    })

    const persistentVolumeBindingsDetails = reactive({
      keys: [],
      map: {}
    })

    const deploymentConfigurationDetails = reactive({
      deploymentMode: '',
      replicas: 0
    })

    const sourceConfigurationRef = reactive({
      gitCredentialID: 0, // TODO null
      gitProvider: "",
      repositoryName: "",
      repositoryOwner: "",
      repositoryBranch: "",
      imageRegistryCredentialID: 0,
      dockerImage: "",
      sourceCodeCompressedFileName: "",
      dockerfile: "",
      buildArgs: {}
    })

    const addEnvironmentVariable = () => {
      const key = uuidv4()
      environmentVariableDetails.keys.push(key)
      environmentVariableDetails.map[key] = {
        name: '',
        value: ''
      }
      triggerUpdateHook()
    }

    const deleteEnvironmentVariable = (key) => {
      let keys
      keys = environmentVariableDetails.keys.filter((k) => k !== key)
      environmentVariableDetails.keys = keys
      delete environmentVariableDetails.map[key]
      triggerUpdateHook()
    }

    const onEnvironmentVariableNameChange = (key, value) => {
      environmentVariableDetails.map[key].name = value
      triggerUpdateHook()
    }

    const onEnvironmentVariableValueChange = (key, value) => {
      environmentVariableDetails.map[key].value = value
      triggerUpdateHook()
    }

    const addPersistentVolumeBinding = () => {
      const key = uuidv4()
      persistentVolumeBindingsDetails.keys.push(key)
      persistentVolumeBindingsDetails.map[key] = {
        persistentVolumeID: -1,
        mountingPath: ''
      }
      triggerUpdateHook()
    }

    const deletePersistentVolumeBinding = (key) => {
      let keys
      keys = persistentVolumeBindingsDetails.keys.filter((k) => k !== key)
      persistentVolumeBindingsDetails.keys = keys
      delete persistentVolumeBindingsDetails.map[key]
      triggerUpdateHook()
    }

    const onPersistentVolumeChange = (key, value) => {
      persistentVolumeBindingsDetails.map[key].persistentVolumeID = value
      triggerUpdateHook()
    }

    const onPersistentVolumeMountingPathChange = (key, value) => {
      persistentVolumeBindingsDetails.map[key].mountingPath = value
      triggerUpdateHook()
    }

    // eslint-disable-next-line no-unused-vars
    const changeDeploymentStrategy = (switchStatus) => {
      alert('Sorry, for change deployment strategy you need to delete and re-create the application\nIn future, we will support this feature')

      // TODO: will be supported in future
      // if (switchStatus) {
      //   deploymentConfigurationDetails.deploymentMode = 'global'
      //   deploymentConfigurationDetails.replicas = 0
      // } else {
      //   deploymentConfigurationDetails.deploymentMode = 'replicated'
      //   deploymentConfigurationDetails.replicas = 1
      // }
      // triggerUpdateHook()
    }

    const replicasCountChanged = () => {
      triggerUpdateHook()
    }

    // someInfoUpdated
    const triggerUpdateHook = () => {
      isConfigurationUpdated.value = checkIfApplicationDetailsAreChanged()
    }

    const {
      result: applicationExistingDetailsResult
    } = useQuery(gql`
      query ($id: String!) {
        application(id: $id) {
          name
          deploymentMode
          replicas
          environmentVariables {
            key
            value
          }
          persistentVolumeBindings {
            id
            mountingPath
          }
          latestDeployment {
            upstreamType
            dockerfile
            buildArgs {
              key
              value
            }
            gitProvider
            gitCredentialID
            repositoryName
            repositoryOwner
            repositoryBranch
            imageRegistryCredentialID
            dockerImage
            sourceCodeCompressedFileName
          }
        }
      }
    `, {
      id: applicationId
    }, {
      fetchPolicy: 'no-cache',
      nextFetchPolicy: 'no-cache'
    })

    function checkIfApplicationDetailsAreChanged() {
      const applicationExistingDetails = applicationExistingDetailsResult.value?.application ?? {}

      // check if deployment mode is changed
      if (applicationExistingDetails.deploymentMode !== deploymentConfigurationDetails.deploymentMode) {
        return true
      }
      // check if replica count is changed
      if (applicationExistingDetails.replicas.toString() !== deploymentConfigurationDetails.replicas.toString()) {
        return true
      }

      // check if environment variables are changed
      const existingEnvironmentVariables = applicationExistingDetails.environmentVariables ?? []
      const existingEnvironmentVariableKeys = existingEnvironmentVariables.map((variable) => variable.key)
      const existingEnvironmentVariableMap = existingEnvironmentVariables.reduce((map, variable) => {
        map[variable.key] = variable.value
        return map
      }, {})
      const newEnvironmentVariableKeys = environmentVariableDetails.keys
      const newEnvironmentVariableMap = environmentVariableDetails.keys.reduce((map, key) => {
        map[environmentVariableDetails.map[key].name] = environmentVariableDetails.map[key].value
        return map
      }, {})
      if (existingEnvironmentVariableKeys.length !== newEnvironmentVariableKeys.length) {
        return true
      }
      for (let i = 0; i < existingEnvironmentVariableKeys.length; i++) {
        const key = existingEnvironmentVariableKeys[i]
        if (existingEnvironmentVariableMap[key] !== newEnvironmentVariableMap[key]) {
          return true
        }
      }
      // check if persistent volume bindings are changed
      const existingPersistentVolumeBindings = applicationExistingDetails.persistentVolumeBindings ?? []
      const existingPersistentVolumeBindingKeys = existingPersistentVolumeBindings.map((binding) => binding.key)
      const existingPersistentVolumeBindingMap = existingPersistentVolumeBindings.reduce((map, binding) => {
        map[binding.key] = binding.mountingPath
        return map
      }, {})
      const newPersistentVolumeBindingKeys = persistentVolumeBindingsDetails.keys
      const newPersistentVolumeBindingMap = persistentVolumeBindingsDetails.keys.reduce((map, key) => {
        map[persistentVolumeBindingsDetails.map[key].persistentVolumeID] = persistentVolumeBindingsDetails.map[key].mountingPath
        return map
      }, {})
      if (existingPersistentVolumeBindingKeys.length !== newPersistentVolumeBindingKeys.length) {
        return true
      }
      for (let i = 0; i < existingPersistentVolumeBindingKeys.length; i++) {
        const key = existingPersistentVolumeBindingKeys[i]
        if (existingPersistentVolumeBindingMap[key] !== newPersistentVolumeBindingMap[key]) {
          return true
        }
      }

      // check if any source configuration is changed
      if (sourceConfigurationRef.gitCredentialID !== applicationExistingDetails.latestDeployment.gitCredentialID) {
        return true
      }
      if (sourceConfigurationRef.gitProvider !== applicationExistingDetails.latestDeployment.gitProvider) {
        return true
      }
      if (sourceConfigurationRef.repositoryName !== applicationExistingDetails.latestDeployment.repositoryName) {
        return true
      }
      if (sourceConfigurationRef.repositoryOwner !== applicationExistingDetails.latestDeployment.repositoryOwner) {
        return true
      }
      if (sourceConfigurationRef.repositoryBranch !== applicationExistingDetails.latestDeployment.repositoryBranch) {
        return true
      }
      if (sourceConfigurationRef.imageRegistryCredentialID !== applicationExistingDetails.latestDeployment.imageRegistryCredentialID) {
        return true
      }
      if (sourceConfigurationRef.dockerImage !== applicationExistingDetails.latestDeployment.dockerImage) {
        return true
      }
      if (sourceConfigurationRef.sourceCodeCompressedFileName !== applicationExistingDetails.latestDeployment.sourceCodeCompressedFileName) {
        return true
      }
      if (sourceConfigurationRef.dockerfile !== applicationExistingDetails.latestDeployment.dockerfile) {
        return true
      }
      // check if build args are changed
      let existingBuildArgs = {};
      (applicationExistingDetails.latestDeployment.buildArgs??[]).forEach((buildArg) => {
        existingBuildArgs[buildArg.key] = buildArg.value
      })
      if (Object.keys(existingBuildArgs).length !== Object.keys(sourceConfigurationRef.buildArgs).length) {
        return true
      }
      for (const key in existingBuildArgs) {
        if (existingBuildArgs[key] !== sourceConfigurationRef.buildArgs[key]) {
          return true
        }
      }
      return false
    }

    const mergeChangesWithExistingApplicationDetails = () => {
      const applicationExistingDetails = applicationExistingDetailsResult.value?.application ?? {}
      if (applicationExistingDetails.length === 0) {
        alert('Failed to fetch application details\nTry again after re-loading the page')
      }

      return {
        name: applicationExistingDetails.name,
        upstreamType: applicationExistingDetails.latestDeployment.upstreamType, // TODO Not allowed to change
        deploymentMode: deploymentConfigurationDetails.deploymentMode,
        replicas: deploymentConfigurationDetails.replicas,
        buildArgs: Object.entries(sourceConfigurationRef.buildArgs).map(([k,v]) => {
          return {
            key: k,
            value: v
          }
        }),
        environmentVariables: environmentVariableDetails.keys.map((key) => {
          return {
            key: environmentVariableDetails.map[key].name,
            value: environmentVariableDetails.map[key].value
          }
        }),
        persistentVolumeBindings: persistentVolumeBindingsDetails.keys.map((key) => {
          return {
            persistentVolumeID: persistentVolumeBindingsDetails.map[key].persistentVolumeID,
            mountingPath: persistentVolumeBindingsDetails.map[key].mountingPath
          }
        }),
        // update this part
        gitCredentialID: sourceConfigurationRef.gitCredentialID,
        gitProvider: sourceConfigurationRef.gitProvider,
        repositoryName: sourceConfigurationRef.repositoryName,
        repositoryOwner: sourceConfigurationRef.repositoryOwner,
        repositoryBranch: sourceConfigurationRef.repositoryBranch,
        imageRegistryCredentialID: sourceConfigurationRef.imageRegistryCredentialID,
        dockerImage: sourceConfigurationRef.dockerImage,
        sourceCodeCompressedFileName: sourceConfigurationRef.sourceCodeCompressedFileName,
        dockerfile: sourceConfigurationRef.dockerfile
      }
    }

    const gitRepoURL = computed(() => {
      const applicationExistingDetails = applicationExistingDetailsResult.value?.application ?? {}
      if (applicationExistingDetails.length === 0) {
        return ''
      }
      return applicationExistingDetails.latestDeployment.gitProvider + '.com/' +
        applicationExistingDetails.latestDeployment.repositoryOwner + '/' +
        applicationExistingDetails.latestDeployment.repositoryName
    })

    const updateApplicationSource = (source) => {
      sourceConfigurationRef.gitCredentialID = source.gitCredentialId
      sourceConfigurationRef.gitProvider = getGitProvideFromGitRepoUrl(source.gitRepoUrl)
      sourceConfigurationRef.repositoryName = getGitRepoNameFromGitRepoUrl(source.gitRepoUrl)
      sourceConfigurationRef.repositoryOwner = getGitRepoOwnerFromGitRepoUrl(source.gitRepoUrl)
      sourceConfigurationRef.repositoryBranch = source.gitBranch
      sourceConfigurationRef.imageRegistryCredentialID = source.imageRegistryCredentialId
      sourceConfigurationRef.dockerImage = source.dockerImage
      sourceConfigurationRef.sourceCodeCompressedFileName = source.sourceCodeCompressedFileName
      sourceConfigurationRef.dockerfile = source.dockerFile
      sourceConfigurationRef.buildArgs = source.buildArgs
      triggerUpdateHook()
    }


    return {
      isConfigurationUpdated,
      applyConfigurationChanges,
      cancelConfigurationChanges,
      applicationDetailsLoading,
      environmentVariableDetails,
      addEnvironmentVariable,
      deleteEnvironmentVariable,
      onEnvironmentVariableNameChange,
      onEnvironmentVariableValueChange,
      persistentVolumeBindingsDetails,
      addPersistentVolumeBinding,
      deletePersistentVolumeBinding,
      onPersistentVolumeChange,
      onPersistentVolumeMountingPathChange,
      deploymentConfigurationDetails,
      changeDeploymentStrategy,
      replicasCountChanged,
      isDeployRequestSubmitting,
      gitRepoURL,
      applicationExistingDetailsResult,
      updateApplicationSource
    }
  })
}