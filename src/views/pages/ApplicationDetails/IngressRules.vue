<script setup>

import TableMessage from '@/views/components/Table/TableMessage.vue'
import Badge from '@/views/components/Badge.vue'
import TableRow from '@/views/components/Table/TableRow.vue'
import Table from '@/views/components/Table/Table.vue'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useToast } from 'vue-toastification'
import FilledButton from '@/views/components/FilledButton.vue'

const router = useRouter()
const toast = useToast()

// Fetch ingress rules
const {
  result: ingressRulesRaw,
  onError: onIngressRulesError
} = useQuery(
  gql`
    query ($id: String!) {
      application(id: $id) {
        ingressRules {
          id
          status
          protocol
          domain {
            name
          }
          port
          application {
            name
          }
          targetPort
        }
      }
    }
  `,
  {
    id: router.currentRoute.value.params.id
  },
  {
    pollInterval: 10000
  }
)

const ingressRules = computed(() => ingressRulesRaw.value?.application?.ingressRules ?? [])

onIngressRulesError((err) => {
  toast.error(err.message)
})

</script>

<template>
  <!-- Table -->
  <Table class="mt-8">
    <template v-slot:header>
      <TableHeader align="left">Rule</TableHeader>
      <TableHeader align="right">Status</TableHeader>
    </template>
    <template v-slot:message>
      <TableMessage v-if="ingressRules.length === 0">
        No Ingress Rules found.<br />
        Click on the below "Manage Ingress Rules" button to add Ingress Rules.
      </TableMessage>
    </template>
    <template v-slot:body>
      <tr v-for="ingressRule in ingressRules" :key="ingressRule.id">
        <TableRow align="left">
          <div class="text-sm text-gray-900">
            <a :href="ingressRule.protocol+'://' + ingressRule.domain.name + ':' + ingressRule.port.toString()"
               target="_blank"
            >{{ ingressRule.protocol }}://{{ ingressRule.domain.name }}:{{ ingressRule.port }}</a
            >&nbsp;&nbsp;
            <font-awesome-icon icon="fa-solid fa-arrow-right" />&nbsp;&nbsp;
            <a target="_blank">{{ ingressRule.application.name }}:{{ ingressRule.targetPort }}</a>
          </div>
        </TableRow>
        <TableRow align="right">
          <Badge v-if="ingressRule.status === 'pending'" type="warning">Pending</Badge>
          <Badge v-else-if="ingressRule.status === 'applied'" type="success">Issued</Badge>
          <Badge v-else-if="ingressRule.status === 'failed'" type="danger">Failed</Badge>
          <Badge v-else-if="ingressRule.status === 'deleting'" type="danger">Deleting</Badge>
        </TableRow>
      </tr>
    </template>
  </Table>
  <!-- More actions  -->
  <div class="flex items-center mt-4 justify-center gap-3">
    Want to add or delete Ingress Rules?
    <FilledButton
      :click="() => router.push({ name: 'Ingress Rules' })"
      type="primary"
      slim
    >Manage Ingress Rules
    </FilledButton>
  </div>
</template>

<style scoped>

</style>