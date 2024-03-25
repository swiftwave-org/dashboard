<script setup>
import Table from '@/views/components/Table/Table.vue'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import PageBar from '@/views/components/PageBar.vue'
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useToast } from 'vue-toastification'
import TableMessage from '@/views/components/Table/TableMessage.vue'
import ServerRow from '@/views/partials/ServerRow.vue'

const toast = useToast()

const {
  result: serversResult,
  loading: isServersLoading,
  onError: onServersError
} = useQuery(
  gql`
    query {
      servers {
        id
        ip
        hostname
        user
        swarmMode
        scheduleDeployments
        dockerUnixSocketPath
        proxyEnabled
        proxyType
        status
      }
    }
  `,
  null,
  {
    pollInterval: 60000
  }
)

onServersError((err) => {
  toast.error(err.message)
})

const servers = computed(() => serversResult.value?.servers ?? [])
</script>

<template>
  <section class="mx-auto w-full max-w-7xl">
    <!-- Top Page bar   -->
    <PageBar>
      <template v-slot:title>Registered Servers</template>
      <template v-slot:subtitle>Take control of your servers</template>
      <template v-slot:buttons>
        <FilledButton type="primary">Add Server</FilledButton>
      </template>
    </PageBar>

    <!-- Table -->
    <Table class="mt-8">
      <template v-slot:header>
        <TableHeader align="left">Server</TableHeader>
        <TableHeader align="center">User</TableHeader>
        <TableHeader align="center">Swarm Mode</TableHeader>
        <TableHeader align="center">Deployment</TableHeader>
        <TableHeader align="center">Proxy</TableHeader>
        <TableHeader align="center">Status</TableHeader>
        <TableHeader align="center">Analytics</TableHeader>
        <TableHeader align="right">Actions</TableHeader>
      </template>
      <template v-slot:message>
        <TableMessage v-if="servers.length === 0">
          No servers found.<br />
          Click on the "Add Server" button to setup a new server.
        </TableMessage>
        <TableMessage v-if="isServersLoading"> Loading deployed applications...</TableMessage>
      </template>
      <template v-slot:body>
        <ServerRow v-for="server in servers" :key="server.id" :server="server" />
      </template>
    </Table>
  </section>
</template>

<style scoped></style>
