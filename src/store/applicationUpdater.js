import { defineStore } from 'pinia'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { reactive, ref, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export default function newApplicationUpdater(applicationId) {
  const storeName = 'application_updater_' + applicationId
  return defineStore(storeName, () => {
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
      alert("Sorry, for change deployment strategy you need to delete and re-create the application\nIn future, we will support this feature")

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
      isConfigurationUpdated.value = checkIfApplicationDetailsAreChanged();
    }

    const { result: applicationExistingDetailsResult,
    onResult: onApplicationExistingDetailsResult
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

    onApplicationExistingDetailsResult(()=>{
      console.log(mergeChangesWithExistingApplicationDetails())
    })

    function checkIfApplicationDetailsAreChanged (){
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
      return false
    }

    const mergeChangesWithExistingApplicationDetails = ()=>{
      const applicationExistingDetails = applicationExistingDetailsResult.value?.application ?? {}
      if (applicationExistingDetails.length === 0) {
        alert('Failed to fetch application details\nTry again after re-loading the page')
      }

      return {
        name: applicationExistingDetails.name,
        upstreamType: applicationExistingDetails.latestDeployment.upstreamType,
        deploymentMode: deploymentConfigurationDetails.deploymentMode,
        replicas: deploymentConfigurationDetails.replicas,
        dockerfile: applicationExistingDetails.latestDeployment.dockerfile,
        buildArgs: applicationExistingDetails.latestDeployment.buildArgs.map((keyValuePair) => {
          return {
            key: keyValuePair.key,
            value: keyValuePair.value
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
        gitCredentialID: applicationExistingDetails.latestDeployment.gitCredentialID,
        gitProvider: applicationExistingDetails.latestDeployment.gitProvider,
        repositoryName: applicationExistingDetails.latestDeployment.repositoryName,
        repositoryOwner: applicationExistingDetails.latestDeployment.repositoryOwner,
        repositoryBranch: applicationExistingDetails.latestDeployment.repositoryBranch,
        imageRegistryCredentialID: applicationExistingDetails.latestDeployment.imageRegistryCredentialID,
        dockerImage: applicationExistingDetails.latestDeployment.dockerImage,
        sourceCodeCompressedFileName: applicationExistingDetails.latestDeployment.sourceCodeCompressedFileName
      }
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
      isDeployRequestSubmitting
    }
  })
}