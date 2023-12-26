<script setup>
import PageBar from '@/views/components/PageBar.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import { useLazyQuery, useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import TableMessage from '@/views/components/Table/TableMessage.vue'
import Table from '@/views/components/Table/Table.vue'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import ModalDialog from '@/views/components/ModalDialog.vue'
import DomainListRow from '@/views/partials/DomainListRow.vue'

const toast = useToast()
const isModalOpen = ref(false)
const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}

// Register Domain state
const newDomainDetails = reactive({
  name: ''
})

const {
  mutate: registerDomain,
  loading: isDomainRegistering,
  onDone: onDomainRegisterSuccess,
  onError: onDomainRegisterFail
} = useMutation(
  gql`
    mutation ($input: DomainInput!) {
      addDomain(input: $input) {
        id
        name
      }
    }
  `,
  {
    variables: {
      input: newDomainDetails
    }
  }
)

onDomainRegisterSuccess(() => {
  closeModal()
  newDomainDetails.name = ''
  toast.success('Domain registered successfully')
  refetchDomainList()
})

onDomainRegisterFail((err) => {
  toast.error(err.message)
})

// Fetch domains from the server
const {
  result: domainListResult,
  refetch: refetchDomainList,
  onError: onDomainListError
} = useQuery(gql`
  query {
    domains {
      id
      name
      sslStatus
      sslIssuer
      sslAutoRenew
    }
  }
`)
const domains = computed(() => domainListResult.value?.domains)

onDomainListError(() => {
  toast.error('Failed to fetch domains')
})

// Delete domain
const {
  mutate: deleteDomain,
  onError: onDomainDeleteError,
  onDone: onDomainDeleteDone
} = useMutation(gql`
  mutation ($id: Uint!) {
    removeDomain(id: $id)
  }
`)

const deleteDomainWithConfirmation = async (domain) => {
  if (confirm('Are you sure you want to delete this domain?')) {
    console.log('Deleting domain', domain)
    console.log('Domain ID', domain.id)
    deleteDomain({ id: domain.id })
  }
}

onDomainDeleteDone(() => {
  toast.success('Domain deleted successfully')
  refetchDomainList()
})

onDomainDeleteError((err) => {
  toast.error(err.message)
})

// Verify DNS
const { result: verifyDnsResult, load: verifyDns } = useLazyQuery(gql`
  query ($name: String!) {
    verifyDomainConfiguration(name: $name)
  }
`)

const verifyDomainDNS = async (domain) => {
  await verifyDns(null, { name: domain.name })
  return verifyDnsResult.value.verifyDomainConfiguration
}
</script>

<template>
  <section class="mx-auto w-full max-w-7xl">
    <!-- Modal for create -->
    <ModalDialog :close-modal="closeModal" :is-open="isModalOpen">
      <template v-slot:header>Register New Domain</template>
      <template v-slot:body>
        Enter the domain or subdomain name you want to register.
        <form @submit.prevent="">
          <!--  Name Field   -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700" for="name">
              Domain Name (example: example.com)
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="newDomainDetails.name"
                autocomplete="off"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                name="name"
                placeholder="example.com or test.example.com"
                type="text" />
            </div>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <FilledButton :click="registerDomain" :loading="isDomainRegistering" type="primary">Register</FilledButton>
      </template>
    </ModalDialog>

    <!-- Top Page bar   -->
    <PageBar>
      <template v-slot:title>Custom Domain</template>
      <template v-slot:subtitle>Manage Registered Domains and SSL Certificates</template>
      <template v-slot:buttons>
        <FilledButton :click="openModal" type="primary">Register New</FilledButton>
      </template>
    </PageBar>

    <!-- Table -->
    <Table class="mt-8">
      <template v-slot:header>
        <TableHeader align="left">Domain Name</TableHeader>
        <TableHeader align="center">SSL Status</TableHeader>
        <TableHeader align="center">SSL Details</TableHeader>
        <TableHeader align="center">SSL Issuer</TableHeader>
        <TableHeader align="center">Issue SSL</TableHeader>
        <TableHeader align="center">SSL Auto-renew</TableHeader>
        <TableHeader align="center">Verify DNS</TableHeader>
        <TableHeader align="right">Actions</TableHeader>
      </template>
      <template v-slot:message>
        <TableMessage v-if="!domains"> Loading domains...</TableMessage>
        <TableMessage v-else-if="domains.length === 0">
          No domains found.<br />
          Click on the "Register New" button to register a new domain.
        </TableMessage>
      </template>
      <template v-slot:body>
        <DomainListRow
          v-for="domain in domains"
          v-bind:key="domain.id"
          :delete-domain="deleteDomainWithConfirmation"
          :domain="domain"
          :verify-dns="verifyDomainDNS" />
      </template>
    </Table>
  </section>
</template>

<style scoped></style>
