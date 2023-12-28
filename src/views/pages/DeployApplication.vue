<script setup>
import { reactive, ref } from 'vue'
import { Tab, TabGroup, TabList, TabPanels } from '@headlessui/vue'
import ApplicationNameSelection from '@/views/partials/DeployApplication/ApplicationNameSelection.vue'

const sectionNames = [
  'Application Name',
  'Select Source',
  'Configure Source',
  'Persistent Volume',
  'Deploy Application'
]

const selectedTabIndex = ref(0)

const changeTab = (index) => {
  selectedTabIndex.value = index
}

// state
const newApplicationState = reactive({
  name: ''
})

// functions
const finalApplicationNameAndMoveToNextTab = (name) => {
  newApplicationState.name = name
  changeTab(1)
}
</script>

<template>
  <div class="flex w-full max-w-7xl flex-col items-center justify-center sm:px-0">
    <TabGroup :selected-index="selectedTabIndex">
      <TabList class="flex w-full max-w-4xl space-x-3 rounded-full bg-primary-600 p-1">
        <Tab v-for="sectionName in sectionNames" :key="sectionName" v-slot="{ selected }" as="template">
          <button :class="selected ? 'tab-button-selected' : 'tab-button-unselected'" class="tab-button">
            {{ sectionName }}
          </button>
        </Tab>
      </TabList>

      <TabPanels class="mt-6 flex w-full flex-col items-center">
        <!-- Application Name Selection -->
        <ApplicationNameSelection :final-application-name-and-move-to-next-tab="finalApplicationNameAndMoveToNextTab" />
        <!-- Source Selection -->
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
