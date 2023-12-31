<script setup>
import Table from '@/views/components/Table/Table.vue'
import TableMessage from '@/views/components/Table/TableMessage.vue'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import TableRow from '@/views/components/Table/TableRow.vue'
import { toRef } from 'vue'

const props = defineProps({
  environmentVariablesKeys: {
    type: Array,
    required: true
  },
  environmentVariablesMap: {
    type: Object,
    required: true,
    default: () => ({})
  },
  addEnvironmentVariable: {
    type: Function,
    required: true
  },
  deleteEnvironmentVariable: {
    type: Function,
    required: true
  },
  onVariableNameChange: {
    type: Function,
    required: true
  },
  onVariableValueChange: {
    type: Function,
    required: true
  }
})

const environmentVariablesKeys = toRef(props, 'environmentVariablesKeys')
</script>

<template>
  <Table>
    <template v-slot:header>
      <TableHeader align="center">Variable Name</TableHeader>
      <TableHeader align="center">Value</TableHeader>
      <TableHeader align="right" class="w-[80px]">Delete</TableHeader>
    </template>
    <template v-slot:message>
      <TableMessage v-if="environmentVariablesKeys.length === 0" class="flex flex-col items-center">
        No Environment Variables found.<br />
        If your application requires environment variables, you can add them here.<br />
        <FilledButton class="mt-3 max-w-fit" @click="addEnvironmentVariable">Add Environment Variable</FilledButton>
      </TableMessage>
      <div v-else class="flex flex-row gap-3 px-6 py-2 text-sm text-gray-600">
        Want to add more environment variables ?
        <FilledButton slim @click="addEnvironmentVariable">Add Environment Variable</FilledButton>
      </div>
    </template>
    <template v-slot:body>
      <tr v-for="key in environmentVariablesKeys" :key="key">
        <TableRow>
          <input
            :key="`name-${key}`"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Environment Variable Name"
            type="text"
            v-bind:value="environmentVariablesMap[key]?.name ?? ''"
            @input="(event) => onVariableNameChange(key, event.target.value)" />
        </TableRow>
        <TableRow>
          <input
            :key="`value-${key}`"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Environment Variable Value"
            type="text"
            v-bind:value="environmentVariablesMap[key]?.value ?? ''"
            @input="(event) => onVariableValueChange(key, event.target.value)" />
        </TableRow>
        <TableRow align="right" class="flex">
          <FilledButton
            :key="`delete-${key}`"
            :click="() => deleteEnvironmentVariable(key)"
            class="w-full"
            type="danger">
            <font-awesome-icon class="mr-2" icon="fa-solid fa-trash" />
            Delete Variable
          </FilledButton>
        </TableRow>
      </tr>
    </template>
  </Table>
</template>

<style scoped></style>
