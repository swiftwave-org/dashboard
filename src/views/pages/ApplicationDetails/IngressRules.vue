<script setup>
import TableMessage from '@/views/components/Table/TableMessage.vue'
import Badge from '@/views/components/Badge.vue'
import TableRow from '@/views/components/Table/TableRow.vue'
import Table from '@/views/components/Table/Table.vue'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'
import FilledButton from '@/views/components/FilledButton.vue'
import CreateIngressRuleModal from '@/views/partials/CreateIngressRuleModal.vue'

const router = useRouter()
const toast = useToast()

// Create new ingress rule
const newIngressRuleModalRef = ref(null)
const openNewIngressRuleModal = () => {
  if (!newIngressRuleModalRef.value?.openModal) return
  newIngressRuleModalRef.value.openModal(router.currentRoute.value.params.id)
}

// Fetch ingress rules
const { result: ingressRulesRaw, onError: onIngressRulesError } = useQuery(
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
  <!-- Create Ingress Rule Modal -->
  <CreateIngressRuleModal ref="newIngressRuleModalRef" />
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
            <a
              v-if="ingressRule.protocol === 'http' || ingressRule.protocol === 'https'"
              :href="ingressRule.protocol + '://' + ingressRule.domain.name + ':' + ingressRule.port.toString()"
              target="_blank"
              >{{ ingressRule.protocol }}://{{ ingressRule.domain.name }}:{{ ingressRule.port }}</a
            >
            <a v-else-if="ingressRule.protocol === 'tcp'" href="javascript:void(0);"
              >tcp://&lt;server-ip&gt;:{{ ingressRule.port }}</a
            >
            <a v-else-if="ingressRule.protocol === 'udp'" href="javascript:void(0);"
              >udp://&lt;server-ip&gt;:{{ ingressRule.port }}</a
            >
            <a v-else href="javascript:void(0);"><i>Unknown</i></a>
            &nbsp;&nbsp;
            <font-awesome-icon icon="fa-solid fa-arrow-right" />&nbsp;&nbsp;
            <a target="_blank">{{ ingressRule.application.name }}:{{ ingressRule.targetPort }}</a>
          </div>
        </TableRow>
        <TableRow align="right">
          <Badge v-if="ingressRule.status === 'pending'" type="warning">Pending</Badge>
          <Badge v-else-if="ingressRule.status === 'applied'" type="success">Applied</Badge>
          <Badge v-else-if="ingressRule.status === 'failed'" type="danger">Failed</Badge>
          <Badge v-else-if="ingressRule.status === 'deleting'" type="danger">Deleting</Badge>
        </TableRow>
      </tr>
    </template>
  </Table>
  <!-- More actions  -->
  <div class="mt-4 flex items-center justify-center gap-3">
    Expose your application to the world
    <FilledButton slim type="primary" :click="openNewIngressRuleModal">Add Ingress Rule</FilledButton>
  </div>
</template>

<style scoped></style>
