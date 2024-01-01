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

// Create redirect rule
const newRedirectRuleDetails = reactive({
  domainId: 0,
  protocol: 'http',
  port: 80,
  redirectURL: ''
})

const {
  mutate: createRedirectRule,
  loading: isRedirectRuleCreating,
  onDone: onRedirectRuleCreateSuccess,
  onError: onRedirectRuleCreateFail
} = useMutation(
  gql`
    mutation ($input: RedirectRuleInput!) {
      createRedirectRule(input: $input) {
        id
      }
    }
  `,
  {
    variables: {
      input: newRedirectRuleDetails
    }
  }
)

onRedirectRuleCreateSuccess(() => {
  closeModal()
  newRedirectRuleDetails.name = ''
  refetchRedirectRules()
})

onRedirectRuleCreateFail((err) => {
  toast.error(err.message)
})

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

// Delete redirect rule
const {
  mutate: deleteRedirectRule,
  onDone: onRedirectDeleteSuccess,
  onError: onRedirectRuleDeleteFail
} = useMutation(
  gql`
    mutation ($id: Uint!) {
      deleteRedirectRule(id: $id)
    }
  `,
  {
    variables: {
      id: 0
    }
  }
)

const deleteRedirectRulesWithConfirmation = (redirect_rules) => {
  if (confirm('Are you sure you want to delete this redirect rule?')) {
    deleteRedirectRule({
      id: redirect_rules.id
    })
  }
}

onRedirectDeleteSuccess(() => {
  toast.success('Redirect Rule deleted successfully')
  refetchRedirectRules()
})

onRedirectRuleDeleteFail((err) => {
  toast.error(err.message)
})

// Fetch redirect rules
const {
  result: redirectRulesRaw,
  refetch: refetchRedirectRules,
  onError: onRedirectRulesError
} = useQuery(
  gql`
    query {
      redirectRules {
        id
        domain {
          name
        }
        redirectURL
        status
        port
      }
    }
  `,
  null,
  {
    pollInterval: 10000
  }
)

const redirectRules = computed(() => redirectRulesRaw.value?.redirectRules ?? [])

onRedirectRulesError((err) => {
  toast.error(err.message)
})
</script>

<template>
  <section class="mx-auto w-full max-w-7xl">
    <!-- Modal for create redirect rules -->
    <ModalDialog :close-modal="closeModal" :is-open="isModalOpen">
      <template v-slot:header>Create Redirect Rule</template>
      <template v-slot:body>
        Enter the details of the new redirect rule.
        <form @submit.prevent="">
          <div class="mb-5 mt-4 rounded border-s-4 border-gray-500 bg-gray-50 p-4" role="alert">
            <p>Only port <strong>80</strong> is supported for now.</p>
          </div>
          <!-- Domains -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700" for="domain">Domain</label>
            <div class="mt-1">
              <select
                id="domain"
                v-model="newRedirectRuleDetails.domainId"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                <option value="0">Select a domain</option>
                <option v-for="domain in domains" :key="domain.id" :value="domain.id">{{ domain.name }}</option>
              </select>
            </div>
          </div>

          <!--  Redirected URL   -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700" for="name">Redirected URL</label>
            <div class="mt-1">
              <input
                id="name"
                v-model="newRedirectRuleDetails.redirectURL"
                autocomplete="off"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                name="name"
                placeholder="Name of redirected URL"
                type="text" />
            </div>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <FilledButton :click="createRedirectRule" :loading="isRedirectRuleCreating" type="primary"
          >Register
        </FilledButton>
      </template>
    </ModalDialog>

    <!-- Top Page bar   -->
    <PageBar>
      <template v-slot:title>Redirect Rules</template>
      <template v-slot:subtitle>Manage Redirect Rules</template>
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
        <TableMessage v-if="redirectRules.length === 0">
          No Redirect Rules found.<br />
          Click on the "Add New" button to create a new redirect rule.
        </TableMessage>
      </template>
      <template v-slot:body>
        <tr v-for="redirectRule in redirectRules" :key="redirectRule.id">
          <TableRow align="left">
            <div class="text-sm font-medium text-gray-900">{{ redirectRule.id }}</div>
          </TableRow>
          <TableRow align="center">
            <Badge v-if="redirectRule.status === 'pending'" type="warning">Pending</Badge>
            <Badge v-else-if="redirectRule.status === 'applied'" type="success">Issued</Badge>
            <Badge v-else-if="redirectRule.status === 'failed'" type="danger">Failed</Badge>
            <Badge v-else-if="redirectRule.status === 'deleting'" type="danger">Deleting</Badge>
          </TableRow>
          <TableRow align="center">
            <div class="text-sm text-gray-900">
              <a :href="'//' + redirectRule.domain.name + ':' + redirectRule.port.toString()" target="_blank"
                >{{ redirectRule.domain.name }}:{{ redirectRule.port }}</a
              >&nbsp;&nbsp; <font-awesome-icon icon="fa-solid fa-arrow-right" />&nbsp;&nbsp;
              <a :href="redirectRule.redirectURL" target="_blank">{{ redirectRule.redirectURL }}</a>
            </div>
          </TableRow>
          <TableRow align="right">
            <TextButton :click="() => deleteRedirectRulesWithConfirmation(redirectRule)" type="danger"
              >Delete
            </TextButton>
          </TableRow>
        </tr>
      </template>
    </Table>
  </section>
</template>

<style scoped></style>
