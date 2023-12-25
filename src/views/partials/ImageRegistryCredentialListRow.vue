<script setup>
import TableRow from '@/views/components/Table/TableRow.vue'
import TextButton from '@/views/components/TextButton.vue'

defineProps({
  imageRegistryCredential: {
    type: Object,
    required: true
  },
  deleteImageRegistryCredential: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <tr>
    <TableRow align="left">
      <div class="text-sm font-medium text-gray-900">
        {{ imageRegistryCredential.url }}
      </div>
    </TableRow>
    <TableRow align="left">
      <div class="text-sm text-gray-900">{{ imageRegistryCredential.username }}</div>
    </TableRow>
    <TableRow align="left">
      <div class="text-sm text-gray-900">{{ imageRegistryCredential.password }}</div>
    </TableRow>
    <TableRow align="right">
      <TextButton
        :click="() => deleteImageRegistryCredential(imageRegistryCredential)"
        type="danger">
        Delete
      </TextButton>
    </TableRow>
  </tr>
</template>

<style scoped></style>
