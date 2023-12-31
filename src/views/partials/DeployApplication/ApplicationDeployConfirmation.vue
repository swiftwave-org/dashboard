<script setup>
import { TabPanel } from '@headlessui/vue'
import FilledButton from '@/views/components/FilledButton.vue'

defineProps({
  isDeployRequestSubmitting: {
    type: Boolean,
    required: true
  },
  deployApplication: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <TabPanel :key="4" class="flex h-full w-full flex-col p-6">
    <div class="flex h-full w-full flex-col items-center justify-center">
      <p class="text-3xl font-bold text-gray-700">👏 Great Job</p>
      <p class="mt-4 text-xl font-medium text-gray-700">You are one step away from deploying your application</p>
      <FilledButton :click="deployApplication" :loading="isDeployRequestSubmitting" class="mt-8 text-lg font-normal"
        >Click to Deploy Application
      </FilledButton>
    </div>
  </TabPanel>
</template>

<style scoped></style>
