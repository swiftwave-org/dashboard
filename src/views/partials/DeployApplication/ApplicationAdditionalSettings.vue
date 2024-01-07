<script setup>
import { TabPanel } from '@headlessui/vue'
import Switch from '@/views/components/Switch.vue'
import { reactive } from 'vue'
import EnvironmentVariablesEditor from '@/views/partials/DeployApplication/EnvironmentVariablesEditor.vue'
import { v4 as uuidv4 } from 'uuid'
import PersistentVolumeBindingEditor from '@/views/partials/DeployApplication/PersistentVolumeBindingEditor.vue'
import FilledButton from '@/views/components/FilledButton.vue'

const props = defineProps({
  finalizeApplicationAdditionalSettingsAndMoveToNextTab: {
    type: Function,
    required: true
  }
})

const stateRef = reactive({
  replicas: 1,
  deploymentStrategy: 'replicated',
  // replicate -> false, global -> true,
  environmentVariablesKeys: [],
  environmentVariablesMap: {},
  persistentVolumeBindingKeys: [],
  persistentVolumeBindingsMap: {}
})

// Environment Variables Functions
const addEnvironmentVariable = () => {
  const key = uuidv4()
  stateRef.environmentVariablesKeys.push(key)
  stateRef.environmentVariablesMap[key] = {
    name: '',
    value: ''
  }
}

const deleteEnvironmentVariable = (key) => {
  let keys
  keys = stateRef.environmentVariablesKeys.filter((k) => k !== key)
  stateRef.environmentVariablesKeys = keys
  delete stateRef.environmentVariablesMap[key]
}

const changeDeploymentStrategy = (switchStatus) => {
  if (switchStatus) {
    stateRef.deploymentStrategy = 'global'
    stateRef.replicas = 0
  } else {
    stateRef.deploymentStrategy = 'replicated'
    stateRef.replicas = 1
  }
}

const onVariableNameChange = (key, value) => {
  stateRef.environmentVariablesMap[key].name = value
}

const onVariableValueChange = (key, value) => {
  stateRef.environmentVariablesMap[key].value = value
}

// Persistent Volume Binding Functions
const addPersistentVolumeBinding = () => {
  const key = uuidv4()
  stateRef.persistentVolumeBindingKeys.push(key)
  stateRef.persistentVolumeBindingsMap[key] = {
    persistentVolumeID: -1,
    mountingPath: ''
  }
}

const deletePersistentVolumeBinding = (key) => {
  let keys
  keys = stateRef.persistentVolumeBindingKeys.filter((k) => k !== key)
  stateRef.persistentVolumeBindingKeys = keys
  delete stateRef.persistentVolumeBindingsMap[key]
}

const onPersistentVolumeChange = (key, value) => {
  stateRef.persistentVolumeBindingsMap[key].persistentVolumeID = value
}

const onMountingPathChange = (key, value) => {
  stateRef.persistentVolumeBindingsMap[key].mountingPath = value
}

const submitDetails = () => {
  let environmentVariables = []
  for (let key in stateRef.environmentVariablesMap) {
    environmentVariables.push({
      key: stateRef.environmentVariablesMap[key].name,
      value: stateRef.environmentVariablesMap[key].value
    })
  }
  let details = {
    deploymentMode: stateRef.deploymentStrategy,
    replicas: stateRef.replicas,
    environmentVariables: environmentVariables,
    persistentVolumeBindings: Object.values(stateRef.persistentVolumeBindingsMap)
  }
  props.finalizeApplicationAdditionalSettingsAndMoveToNextTab(details)
}

</script>

<template>
  <TabPanel :key="3" class="flex h-full w-full flex-col p-6">
    <!-- Deployment Configuration -->
    <p class="mt-6 text-lg font-medium text-gray-900">Deployment Configuration</p>
    <div class="mt-3 flex flex-row items-center">
      <p>Deployment Strategy</p>
      <font-awesome-icon class="px-4" icon="fa-solid fa-arrow-right" />
      <p class="font-medium">Replicated</p>
      <Switch :enabled="stateRef.deploymentStrategy === 'global'" :onChange="changeDeploymentStrategy" class="mx-4" />
      <p class="font-medium">Global</p>
    </div>
    <!-- Replicas -->
    <div v-if="stateRef.deploymentStrategy === 'replicated'" class="mt-6 max-w-md">
      <label class="block text-sm font-medium text-gray-700" for="no_of_replicase"
        >No of Replicas <span class="text-red-600"> *</span>
      </label>
      <div class="mt-1">
        <input
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          name="no_of_replicase"
          placeholder="No of Replicas"
          type="number"
          v-model="stateRef.replicas"
        />
      </div>
    </div>
    <!-- Environment Variables -->
    <p class="mt-6 text-lg font-medium text-gray-900">Environment Variables</p>
    <EnvironmentVariablesEditor
      :add-environment-variable="addEnvironmentVariable"
      :delete-environment-variable="deleteEnvironmentVariable"
      :environment-variables-keys="stateRef.environmentVariablesKeys"
      :environment-variables-map="stateRef.environmentVariablesMap"
      :on-variable-name-change="onVariableNameChange"
      :on-variable-value-change="onVariableValueChange"
      class="mt-2" />
    <!-- Persistent Volumes -->
    <p class="mt-6 text-lg font-medium text-gray-900">Persistent Volumes</p>
    <PersistentVolumeBindingEditor
      :add-persistent-volume-binding="addPersistentVolumeBinding"
      :delete-persistent-volume-binding="deletePersistentVolumeBinding"
      :on-mounting-path-change="onMountingPathChange"
      :on-persistent-volume-change="onPersistentVolumeChange"
      :persistent-volume-binding-keys="stateRef.persistentVolumeBindingKeys"
      :persistent-volume-bindings-map="stateRef.persistentVolumeBindingsMap"
      class="mt-2" />
    <!-- Proceed to next -->
    <div class="mt-6 flex flex-row justify-end">
      <FilledButton type="primary" @click="submitDetails"
        >Confirm & Proceed to Next
      </FilledButton>
    </div>
  </TabPanel>
</template>

<style scoped></style>
