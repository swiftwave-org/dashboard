import { defineStore } from 'pinia'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { reactive, ref, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export default function newApplicationUpdater(applicationId) {
  const storeName = 'application_updater_' + applicationId
  return defineStore(storeName, () => {
    const isConfigurationUpdated = ref(false)
    const applyConfigurationChanges = () => {
      alert('applyConfigurationChanges')
    }
    const cancelConfigurationChanges = () => {
      alert('cancelConfigurationChanges')
    }

    // Environment Variables
    const {
      result: environmentVariablesRaw,
      loading: environmentVariablesLoading
    } = useQuery(gql`
      query ($id: String!) {
        application(id: $id) {
          environmentVariables {
            key
            value
          }
        }
      }
    `, {
      id: applicationId
    })

    watch(environmentVariablesRaw, () => {
      const environmentVariables = environmentVariablesRaw.value?.application?.environmentVariables ?? []
      environmentVariableDetails.keys = environmentVariables.map((variable) => variable.key)
      environmentVariableDetails.map = environmentVariables.reduce((map, variable) => {
        map[uuidv4()] = {
          name: variable.key,
          value: variable.value
        }
        return map
      }, {})
    })

    const environmentVariableDetails = reactive({
      keys: [],
      map: {}
    })

    const addEnvironmentVariable = () => {
      const key = uuidv4()
      environmentVariableDetails.keys.push(key)
      environmentVariableDetails.map[key] = {
        name: '',
        value: ''
      }
    }

    const deleteEnvironmentVariable = (key) => {
      let keys
      keys = environmentVariableDetails.keys.filter((k) => k !== key)
      environmentVariableDetails.keys = keys
      delete environmentVariableDetails.map[key]
    }

    const onEnvironmentVariableNameChange = (key, value) => {
      environmentVariableDetails.map[key].name = value
    }

    const onEnvironmentVariableValueChange = (key, value) => {
      environmentVariableDetails.map[key].value = value
    }

    // Persistent Volume bindings
    const {
      result: persistentVolumeBindingsRaw,
      loading: persistentVolumeBindingsLoading
    } = useQuery(gql`
      query ($id: String!) {
        application(id: $id) {
          persistentVolumeBindings {
            persistentVolumeID
            mountingPath
          }
        }
      }
    `, {
      id: applicationId
    })

    watch(persistentVolumeBindingsRaw, () => {
      const persistentVolumeBindings = persistentVolumeBindingsRaw.value?.application?.persistentVolumeBindings ?? []
      persistentVolumeBindingsDetails.keys = persistentVolumeBindings.map((binding) => binding.key)
      persistentVolumeBindingsDetails.map = persistentVolumeBindings.reduce((map, binding) => {
        map[uuidv4()] = {
          persistentVolumeID: binding.persistentVolumeID,
          mountingPath: binding.mountingPath
        }
        return map
      }, {})
    })

    const persistentVolumeBindingsDetails = reactive({
      keys: [],
      map: {}
    })

    const addPersistentVolumeBinding = () => {
      const key = uuidv4()
      persistentVolumeBindingsDetails.keys.push(key)
      persistentVolumeBindingsDetails.map[key] = {
        persistentVolumeID: -1,
        mountingPath: ''
      }
    }

    const deletePersistentVolumeBinding = (key) => {
      let keys
      keys = persistentVolumeBindingsDetails.keys.filter((k) => k !== key)
      persistentVolumeBindingsDetails.keys = keys
      delete persistentVolumeBindingsDetails.map[key]
    }

    const onPersistentVolumeChange = (key, value) => {
      persistentVolumeBindingsDetails.map[key].persistentVolumeID = value
    }

    const onPersistentVolumeMountingPathChange = (key, value) => {
      persistentVolumeBindingsDetails.map[key].mountingPath = value
    }

    return {
      isConfigurationUpdated,
      applyConfigurationChanges,
      cancelConfigurationChanges,
      environmentVariablesLoading,
      environmentVariableDetails,
      addEnvironmentVariable,
      deleteEnvironmentVariable,
      onEnvironmentVariableNameChange,
      onEnvironmentVariableValueChange,
      persistentVolumeBindingsLoading,
      persistentVolumeBindingsDetails,
      addPersistentVolumeBinding,
      deletePersistentVolumeBinding,
      onPersistentVolumeChange,
      onPersistentVolumeMountingPathChange
    }
  })
}