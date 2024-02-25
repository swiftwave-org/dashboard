<script setup>
import PageBar from '@/views/components/PageBar.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import { useLazyQuery, useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'
import TableMessage from '@/views/components/Table/TableMessage.vue'
import Table from '@/views/components/Table/Table.vue'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import ModalDialog from '@/views/components/ModalDialog.vue'
import DomainListRow from '@/views/partials/DomainListRow.vue'
import Disclosure from '@/views/components/Disclosure.vue'
import moment from 'moment'
import CreateDomainModal from '@/views/partials/CreateDomainModal.vue'

const toast = useToast()

const isDetailsModalOpen = ref(false)
const openDetailsModal = () => {
  isDetailsModalOpen.value = true
}
const closeDetailsModal = () => {
  isDetailsModalOpen.value = false
}

// Fetch domains from the server
const {
  result: domainListResult,
  refetch: refetchDomainList,
  onError: onDomainListError
} = useQuery(
  gql`
    query {
      domains {
        id
        name
        sslStatus
        sslIssuer
        sslAutoRenew
      }
    }
  `,
  null,
  {
    pollInterval: 10000
  }
)
const domains = computed(() => domainListResult.value?.domains ?? [])

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

// View SSL Details
const {
  result: viewSslDetailsResultRaw,
  load: viewSslDetails,
  refetch: refetchSslDetails,
  onResult: onSslDetailsResult,
  variables: viewSslDetailsVars
} = useLazyQuery(
  gql`
    query ($id: Uint!) {
      domain(id: $id) {
        sslStatus
        sslIssuer
        sslIssuedAt
        sslFullChain
        sslPrivateKey
      }
    }
  `,
  {
    variables: {
      id: 0
    }
  },
  {
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache'
  }
)

const viewSslDetailsResult = computed(() => viewSslDetailsResultRaw.value?.domain ?? {})
const sslDetailsIssuedAt = computed(() => {
  if (!viewSslDetailsResultRaw.value?.domain ?? '') {
    return ''
  }
  if (viewSslDetailsResultRaw.value?.domain) {
    return moment(viewSslDetailsResultRaw.value?.domain.sslIssuedAt).format('YYYY-MM-DD HH:mm:ss')
  }
  return ''
})

onSslDetailsResult(() => {
  openDetailsModal()
})

const viewDomainSSLDetails = async (domain_id) => {
  viewSslDetailsVars.value.id = domain_id
  let res = await viewSslDetails()
  if (res === false) await refetchSslDetails()
}

// Verify DNS
const {
  result: verifyDnsResult,
  load: verifyDns,
  variables: verifyDnsVars
} = useLazyQuery(
  gql`
    query ($name: String!) {
      verifyDomainConfiguration(name: $name)
    }
  `,
  {
    variables: {
      name: ''
    }
  },
  {
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache'
  }
)

const verifyDomainDNS = async (domain_name) => {
  verifyDnsVars.value.name = domain_name
  await verifyDns()
  return verifyDnsResult.value.verifyDomainConfiguration
}

// Issue SSL
const {
  mutate: issueSsl,
  onError: onIssueSslError,
  onDone: onIssueSslDone
} = useMutation(
  gql`
    mutation ($id: Uint!) {
      issueSSL(id: $id) {
        name
      }
    }
  `,
  {
    variables: {
      id: ''
    }
  }
)

const issueSSLWithConfirmation = async (domain) => {
  if (confirm('Are you sure you want to issue SSL for this domain?')) {
    issueSsl({ id: domain.id })
  }
}

onIssueSslDone(() => {
  toast.success('SSL issue request submitted successfully')
  refetchDomainList()
})

onIssueSslError((err) => {
  toast.error(err.message)
})

// Create Domain
const createDomainModal = ref(null)
const openNewDomainModal = computed(() => createDomainModal.value?.openModal ?? (() => {}))
</script>

<template>
  <section class="mx-auto w-full max-w-7xl">
    <!-- Modal for add domain -->
    <CreateDomainModal :callback-on-create="refetchDomainList" ref="createDomainModal" />
    <!-- Modal for show ssl details domain -->
    <ModalDialog :close-modal="closeDetailsModal" :is-open="isDetailsModalOpen">
      <template v-slot:header>SSL details of the Domain</template>
      <template v-slot:body>
        <div>
          <p class="mt-0.5"><b>SSL Status :</b> {{ (viewSslDetailsResult?.sslStatus ?? '').toUpperCase() }}</p>
          <p class="mt-0.5"><b>SSL Issued By :</b> {{ viewSslDetailsResult.sslIssuer }}</p>
          <p class="mt-0.5"><b>SSL Issued At :</b> {{ sslDetailsIssuedAt }}</p>
          <Disclosure class="mt-4">
            <template v-slot:title>SSL Full Chain Details</template>
            <template v-slot:body>
              <textarea
                class="mt-2 w-full rounded-lg border-gray-200 align-top shadow-sm sm:text-sm"
                readonly
                rows="5"
                v-bind:value="viewSslDetailsResult.sslFullChain"></textarea>
            </template>
          </Disclosure>
          <Disclosure class="mt-3">
            <template v-slot:title>SSL Private Key Details</template>
            <template v-slot:body>
              <textarea
                class="mt-2 w-full rounded-lg border-gray-200 align-top shadow-sm sm:text-sm"
                readonly
                rows="5"
                v-bind:value="viewSslDetailsResult.sslPrivateKey"></textarea>
            </template>
          </Disclosure>
        </div>
      </template>
    </ModalDialog>

    <!-- Top Page bar   -->
    <PageBar>
      <template v-slot:title>Custom Domain</template>
      <template v-slot:subtitle>Manage Registered Domains and SSL Certificates</template>
      <template v-slot:buttons>
        <FilledButton :click="openNewDomainModal" type="primary">Register New</FilledButton>
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
        <TableMessage v-if="domains.length === 0">
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
          :issue-ssl="issueSSLWithConfirmation"
          :verify-dns="verifyDomainDNS"
          :view-ssl="viewDomainSSLDetails" />
      </template>
    </Table>
  </section>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  width: 0.5em;
}

textarea::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

textarea::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
  border-radius: 15px;
}
</style>
