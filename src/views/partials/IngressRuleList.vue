<script setup>
import TableMessage from '@/views/components/Table/TableMessage.vue'
import TextButton from '@/views/components/TextButton.vue'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import Table from '@/views/components/Table/Table.vue'
import Badge from '@/views/components/Badge.vue'
import TableRow from '@/views/components/Table/TableRow.vue'
import { useToast } from 'vue-toastification'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'

const props = defineProps({
  applicationId: {
    type: String,
    required: false,
    default: ''
  }
})
const toast = useToast()

// Delete ingress rule
const {
  mutate: deleteIngressRule,
  onDone: onIngressDeleteSuccess,
  onError: onIngressRuleDeleteFail
} = useMutation(
  gql`
    mutation ($id: Uint!) {
      deleteIngressRule(id: $id)
    }
  `,
  {
    variables: {
      id: 0
    }
  }
)

const deleteIngressRulesWithConfirmation = (ingress_rule) => {
  if (confirm('Are you sure you want to delete this ingress rule ?')) {
    deleteIngressRule({
      id: ingress_rule.id
    })
  }
}

onIngressDeleteSuccess(() => {
  toast.success('Ingress Rule deleted successfully')
  refetchIngressRules()
})

onIngressRuleDeleteFail((err) => {
  toast.error(err.message)
})

// Queries
const fetchAllIngressRulesQuery = gql`
  query {
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
`
const applicationSpecificIngressRulesQuery = gql`
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
`
// Fetch ingress rules
const {
  result: ingressRulesRaw,
  refetch: refetchIngressRules,
  onError: onIngressRulesError
} = useQuery(
  props.applicationId ? applicationSpecificIngressRulesQuery : fetchAllIngressRulesQuery,
  {
    id: props.applicationId
  },
  {
    pollInterval: 10000
  }
)

const ingressRules = computed(() =>
  props.applicationId
    ? ingressRulesRaw.value?.application?.ingressRules ?? []
    : ingressRulesRaw.value?.ingressRules ?? []
)

onIngressRulesError((err) => {
  toast.error(err.message)
})

defineExpose({
  refetchIngressRules
})
</script>

<template>
  <!-- Table -->
  <Table>
    <template v-slot:header>
      <TableHeader align="left">ID</TableHeader>
      <TableHeader align="center">Status</TableHeader>
      <TableHeader align="center">Rule</TableHeader>
      <TableHeader align="right">Actions</TableHeader>
    </template>
    <template v-slot:message>
      <TableMessage v-if="ingressRules.length === 0">
        No Ingress Rules found.<br />
        Click on the "Add New" button to create a new Ingress rule.
      </TableMessage>
    </template>
    <template v-slot:body>
      <tr v-for="ingressRule in ingressRules" :key="ingressRule.id">
        <TableRow align="left">
          <div class="text-sm font-medium text-gray-900">{{ ingressRule.id }}</div>
        </TableRow>
        <TableRow align="center">
          <Badge v-if="ingressRule.status === 'pending'" type="warning">Pending</Badge>
          <Badge v-else-if="ingressRule.status === 'applied'" type="success">Applied</Badge>
          <Badge v-else-if="ingressRule.status === 'failed'" type="danger">Failed</Badge>
          <Badge v-else-if="ingressRule.status === 'deleting'" type="danger">Deleting</Badge>
        </TableRow>
        <TableRow align="center">
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
            &nbsp;&nbsp;<font-awesome-icon icon="fa-solid fa-arrow-right" />&nbsp;&nbsp;
            <a href="javascript:void(0);">{{ ingressRule.application.name }}:{{ ingressRule.targetPort }}</a>
          </div>
        </TableRow>
        <TableRow align="right">
          <TextButton :click="() => deleteIngressRulesWithConfirmation(ingressRule)" type="danger">Delete</TextButton>
        </TableRow>
      </tr>
    </template>
  </Table>
</template>

<style scoped></style>
