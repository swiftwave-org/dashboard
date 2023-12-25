<script setup>
import TableRow from '@/views/components/Table/TableRow.vue'
import Badge from '@/views/components/Badge.vue'
import TextButton from '@/views/components/TextButton.vue'

defineProps({
  user: {
    type: Object,
    required: true
  },
  deleteUser: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <tr>
    <TableRow align="left">
      <div class="text-sm font-medium text-gray-900">
        {{ user.username }}
      </div>
    </TableRow>
    <TableRow align="left">
      <div class="text-sm text-gray-900">{{ user.id }}</div>
    </TableRow>
    <TableRow align="center">
      <Badge type="success">Active</Badge>
    </TableRow>
    <TableRow align="left">
      <span class="text-sm text-gray-700"> Administrator </span>
    </TableRow>
    <TableRow align="right">
      <TextButton
        :click="() => deleteUser(user)"
        type="danger">
        Delete
      </TextButton>
    </TableRow>
  </tr>
</template>

<style scoped></style>
