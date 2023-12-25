<script setup>
import TableRow from '@/views/components/Table/TableRow.vue'
import TextButton from '@/views/components/TextButton.vue'

defineProps({
  gitCredential: {
    type: Object,
    required: true
  },
  deleteGitCredential: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <tr>
    <TableRow align="left">
      <div class="text-sm font-medium text-gray-900">
        {{ gitCredential.name }}
      </div>
    </TableRow>
    <TableRow align="left">
      <div class="text-sm text-gray-900">{{ gitCredential.username }}</div>
    </TableRow>
    <TableRow align="left">
      <div class="text-sm text-gray-900">{{ gitCredential.password }}</div>
    </TableRow>
    <TableRow align="right">
      <TextButton
        :click="() => deleteGitCredential(gitCredential)"
        type="danger">
        Delete
      </TextButton>
    </TableRow>
  </tr>
</template>

<style scoped></style>
