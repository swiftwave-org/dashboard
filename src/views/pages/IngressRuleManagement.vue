<script setup>
import PageBar from '@/views/components/PageBar.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import { useToast } from 'vue-toastification'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import Table from '@/views/components/Table/Table.vue'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import TableMessage from '@/views/components/Table/TableMessage.vue'
import TableRow from '@/views/components/Table/TableRow.vue'
import { computed, reactive, ref } from 'vue'
import TextButton from '@/views/components/TextButton.vue'
import ModalDialog from '@/views/components/ModalDialog.vue'
import Badge from '@/views/components/Badge.vue'

const toast = useToast()
const isModalOpen = ref(false)
const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}

// Create ingress rule
const newIngressRuleDetails = reactive({
  protocol: 'http',
  domainId: 0,
  port: 80,
  applicationId: '',
  targetPort: 80,
})

const {
  mutate: createIngressRule,
  loading: isIngressRuleCreating,
  onDone: onIngressRuleCreateSuccess,
  onError: onIngressRuleCreateFail
} = useMutation(
  gql`
    mutation ($input: IngressRuleInput!) {
      createIngressRule(input: $input) {
        id
      }
    }
  `,
  {
    variables: {
      input: newIngressRuleDetails
    }
  }
)

onIngressRuleCreateSuccess(() => {
  closeModal()
  toast.success('Ingress Rule created successfully')
  refetchIngressRules()
})

onIngressRuleCreateFail((err) => {
  toast.error(err.message)
})

const onChangeProtocol = () => {
  if(newIngressRuleDetails.protocol === "https"){
    newIngressRuleDetails.port = 443;
  }
  else if(newIngressRuleDetails.protocol === "http") {
    newIngressRuleDetails.port = 80;
  }
}

// Fetch domains from the server
const { result: domainListResult } = useQuery(
  gql`
    query {
      domains {
        id
        name
      }
    }
  `,
  null,
  {
    pollInterval: 10000
  }
)
const domains = computed(() => domainListResult.value?.domains ?? [])

// Fetch applications from the server
const { result: applicationListResult } = useQuery(
  gql`
    query {
      applications {
        id
        name
      }
    }
  `,
  null,
  {
    pollInterval: 10000
  }
)
const applications = computed(() => applicationListResult.value?.applications ?? [])


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

// Fetch ingress rules
const {
  result: ingressRulesRaw,
  refetch: refetchIngressRules,
  onError: onIngressRulesError
} = useQuery(
  gql`
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
  `,
  null,
  {
    pollInterval: 10000
  }
)

const ingressRules = computed(() => ingressRulesRaw.value?.ingressRules ?? [])

onIngressRulesError((err) => {
  toast.error(err.message)
})
</script>

<template>
  <section class="mx-auto w-full max-w-7xl">
    <!-- Modal for create persistent volumes -->
    <ModalDialog :close-modal="closeModal" :is-open="isModalOpen" width="lg">
      <template v-slot:header>Create Ingress Rule</template>
      <template v-slot:body>
        Enter the details of the new ingress rule.
        <form @submit.prevent="">
          <!-- Domains -->
          <div class="mt-4">
            <p class="block text-sm font-medium text-gray-700">Ingress Info</p>
            <div class="mt-2 flex space-x-2">
              <select
                v-model="newIngressRuleDetails.protocol"
                @change="onChangeProtocol"
                class="w-4/12 block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                <option value="http">HTTP</option>
                <option value="https">HTTPS</option>
                <option value="tcp">TCP</option>
              </select>
              <select
                v-model="newIngressRuleDetails.domainId"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                <option value="0">Select a domain</option>
                <option v-for="domain in domains" :key="domain.id" :value="domain.id">{{ domain.name }}</option>
              </select>
              <input
                v-model="newIngressRuleDetails.port"
                :readonly="newIngressRuleDetails.protocol === 'https'"
                autocomplete="off"
                class="w-3/12 block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm read-only:bg-gray-100"
                placeholder="Port"
                type="number" />
            </div>
          </div>

          <div class="text-center w-full mt-4 text-xl">
            <font-awesome-icon icon="fa-solid fa-arrow-down" />
          </div>

          <div class="mt-4">
            <p class="block text-sm font-medium text-gray-700">Application Name</p>
            <div class="mt-1 flex space-x-2">
              <select
                v-model="newIngressRuleDetails.applicationId"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                <option value="">Select application name</option>
                <option v-for="application in applications" :key="application.id" :value="application.id">{{ application.name }}</option>
              </select>
              <input
                v-model="newIngressRuleDetails.targetPort"
                class="w-3/12 block rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Port"
                type="number" />
            </div>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <FilledButton :click="createIngressRule" :loading="isIngressRuleCreating" type="primary"
        >Create Now
        </FilledButton>
      </template>
    </ModalDialog>

    <!-- Top Page bar   -->
    <PageBar>
      <template v-slot:title>Ingress Rules</template>
      <template v-slot:subtitle>Manage Ingress Rules</template>
      <template v-slot:buttons>
        <FilledButton :click="openModal" type="primary">Add New</FilledButton>
      </template>
    </PageBar>

    <!-- Table -->
    <Table class="mt-8">
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
            <Badge v-else-if="ingressRule.status === 'applied'" type="success">Issued</Badge>
            <Badge v-else-if="ingressRule.status === 'failed'" type="danger">Failed</Badge>
            <Badge v-else-if="ingressRule.status === 'deleting'" type="danger">Deleting</Badge>
          </TableRow>
          <TableRow align="center">
            <div class="text-sm text-gray-900">
              <a :href="ingressRule.protocol+'://' + ingressRule.domain.name + ':' + ingressRule.port.toString()" target="_blank"
              >{{ ingressRule.protocol }}://{{ ingressRule.domain.name }}:{{ ingressRule.port }}</a
              >&nbsp;&nbsp; <font-awesome-icon icon="fa-solid fa-arrow-right" />&nbsp;&nbsp;
              <a target="_blank">{{ ingressRule.application.name }}:{{ ingressRule.targetPort }}</a>
            </div>
          </TableRow>
          <TableRow align="right">
            <TextButton :click="() => deleteIngressRulesWithConfirmation(ingressRule)" type="danger"
            >Delete
            </TextButton>
          </TableRow>
        </tr>
      </template>
    </Table>
  </section>
</template>

<style scoped></style>
