<script setup>
defineProps({
  finalApplicationNameAndMoveToNextTab: {
    type: Function,
    required: true
  }
})

import FilledButton from '@/views/components/FilledButton.vue'
import { TabPanel } from '@headlessui/vue'
import { ref } from 'vue'
import { useLazyQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { debounce } from 'lodash'

// state
const newApplicationName = ref('')
// Is exist application name
const isExistApplicationName = ref(true)
const {
  loading: isExistApplicationNameLoading,
  load: isExistApplicationLoad,
  variables: isExistApplicationVariables,
  onResult: onIsExistApplicationNameResult
} = useLazyQuery(
  gql`
    query ($name: String!) {
      isExistApplicationName(name: $name)
    }
  `,
  {
    name: ''
  }
)

onIsExistApplicationNameResult((result) => {
  if (result.data?.isExistApplicationName !== null && result.data?.isExistApplicationName !== undefined) {
    isExistApplicationName.value = result.data?.isExistApplicationName === true
  }
})

const isExistApplicationNameCheck = debounce(() => {
  if (newApplicationName.value === '') {
    isExistApplicationName.value = true
    return
  }
  newApplicationName.value = newApplicationName.value.replace(/[^a-zA-Z0-9]/g, '')
  isExistApplicationVariables.value.name = newApplicationName.value
  isExistApplicationLoad()
}, 500)
</script>

<template>
  <TabPanel :key="1" class="mt-5 w-full max-w-md">
    <div class="mt-4">
      <label class="block text-sm font-medium text-gray-700" for="application_name"> Application Name </label>
      <div class="mt-1">
        <input
          id="application_name"
          v-model="newApplicationName"
          :disabled="isExistApplicationNameLoading"
          autocomplete="off"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          v-on:input="isExistApplicationNameCheck" />
      </div>
      <div
        v-if="
          newApplicationName !== '' &&
          !isExistApplicationNameLoading &&
          isExistApplicationVariables.name === newApplicationName
        ">
        <p v-if="isExistApplicationName" class="mt-1 text-sm text-danger-600">
          Sorry, {{ newApplicationName }} name is not available
        </p>
        <p v-else-if="!isExistApplicationName" class="mt-1 text-sm text-success-600">
          {{ newApplicationName }} name is available
        </p>
      </div>
    </div>
    <FilledButton
      :disabled="isExistApplicationName"
      :loading="isExistApplicationNameLoading"
      class="mt-4 w-full"
      type="primary"
      @click="() => finalApplicationNameAndMoveToNextTab(newApplicationName)">
      Check & Proceed to Next
    </FilledButton>
  </TabPanel>
</template>

<style scoped></style>
