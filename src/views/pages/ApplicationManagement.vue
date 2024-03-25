<script setup>
import PageBar from '@/views/components/PageBar.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import { useRouter } from 'vue-router'
import TableHeader from '@/views/components/Table/TableHeader.vue'
import TableMessage from '@/views/components/Table/TableMessage.vue'
import Table from '@/views/components/Table/Table.vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'
import ApplicationListRow from '@/views/partials/ApplicationListRow.vue'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const deployNewApplication = () => {
  router.push('/deploy/application')
}

const {
  result: applicationsResult,
  loading: isApplicationsLoading,
  onError: onApplicationsError
} = useQuery(
  gql`
    query {
      applications {
        id
        name
        deploymentMode
        replicas
        isSleeping
        realtimeInfo {
          InfoFound
          DesiredReplicas
          RunningReplicas
          DeploymentMode
        }
        latestDeployment {
          status
          upstreamType
          gitProvider
          createdAt
        }
      }
    }
  `,
  null,
  {
    pollInterval: 10000
  }
)

onApplicationsError((err) => {
  toast.error(err.message)
})

const applications = computed(() => applicationsResult.value?.applications ?? [])
</script>

<template>
  <section class="mx-auto w-full max-w-7xl">
    <!-- Top Page bar   -->
    <PageBar>
      <template v-slot:title>Deployed Applications</template>
      <template v-slot:subtitle>Take control of your deployed applications</template>
      <template v-slot:buttons>
        <FilledButton :click="deployNewApplication" type="primary">Deploy New</FilledButton>
      </template>
    </PageBar>

    <!-- Table -->
    <Table class="mt-8">
      <template v-slot:header>
        <TableHeader align="left">Application Name</TableHeader>
        <TableHeader align="center">Status</TableHeader>
        <TableHeader align="center">Replicas</TableHeader>
        <TableHeader align="center">Source</TableHeader>
        <TableHeader align="center">Last Deployment</TableHeader>
        <TableHeader align="right">Details</TableHeader>
      </template>
      <template v-slot:message>
        <TableMessage v-if="applications.length === 0">
          No deployed applications found.<br />
          Click on the "Deploy New" button to deploy a new application.
        </TableMessage>
        <TableMessage v-if="isApplicationsLoading"> Loading deployed applications...</TableMessage>
      </template>
      <template v-slot:body>
        <ApplicationListRow v-for="application in applications" :key="application.id" :application="application" />
      </template>
    </Table>
  </section>
</template>

<style scoped></style>
