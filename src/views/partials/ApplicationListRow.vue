<script setup>
import TableRow from '@/views/components/Table/TableRow.vue'
import Badge from '@/views/components/Badge.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import { computed } from 'vue'
import moment from 'moment'
import router from '@/router/index.js'

const props = defineProps({
  application: {
    type: Object,
    required: true
  }
})

const createdAtFormatted = computed(() => {
  return moment(props.application.latestDeployment.createdAt).format('DD/MM/YYYY HH:mm')
})
const viewApplicationDetails = () => {
  router.push(`/application/${props.application.id}/deployments`)
}
</script>

<template>
  <tr>
    <TableRow align="left">
      <div class="text-sm font-medium text-gray-900">
        {{ application.name }}
      </div>
    </TableRow>
    <TableRow align="center">
      <Badge v-if="application.latestDeployment.status === 'pending'" type="warning">Pending</Badge>
      <Badge v-else-if="application.latestDeployment.status === 'deployPending'" type="warning">Deploy Pending</Badge>
      <Badge v-else-if="application.latestDeployment.status === 'deploying'" type="warning">Deploying</Badge>
      <Badge v-else-if="application.latestDeployment.status === 'live'" type="success">Live</Badge>
      <Badge v-else-if="application.latestDeployment.status === 'stopped'" type="warning">Stopped</Badge>
      <Badge v-else-if="application.latestDeployment.status === 'failed'" type="danger">Failed</Badge>
    </TableRow>
    <!-- Replicas -->
    <TableRow v-if="!application.isSleeping && application.realtimeInfo.InfoFound" align="center">
      <div v-if="application.deploymentMode === 'replicated'" class="text-sm text-gray-900">
        {{ application.realtimeInfo.RunningReplicas }} / {{ application.realtimeInfo.DesiredReplicas }}
      </div>
      <div v-else-if="application.deploymentMode === 'global'" class="text-sm text-gray-900">Global</div>
      <div v-else class="text-sm text-gray-900">----</div>
    </TableRow>
    <TableRow v-else-if="application.isSleeping" align="center">
      <Badge type="warning">
        <div class="flex flex-row items-center gap-1.5">
          <font-awesome-icon icon="fa-solid fa-moon" />
          Sleeping
        </div>
      </Badge>
    </TableRow>
    <TableRow v-else align="center">
      <div class="text-sm text-gray-900">----</div>
    </TableRow>
    <!-- END Replicas -->
    <TableRow align="center">
      <span v-if="application.latestDeployment.upstreamType === 'git'" class="text-sm uppercase text-gray-700">
        <font-awesome-icon icon="fa-solid fa-code-branch" class="mx-2" /> {{ application.latestDeployment.gitProvider }}
      </span>
      <span v-else-if="application.latestDeployment.upstreamType === 'image'" class="text-sm text-gray-700"
        ><font-awesome-icon class="mx-2" icon="fa-brands fa-docker" />Docker Image</span
      >
      <span v-else-if="application.latestDeployment.upstreamType === 'sourceCode'" class="text-sm text-gray-700">
        <font-awesome-icon class="mx-2" icon="fa-solid fa-upload" />
        Source Code</span
      >
      <span v-else class="text-sm text-gray-700">N/A</span>
    </TableRow>
    <TableRow align="center">
      <span class="text-sm text-gray-700"> {{ createdAtFormatted }} </span>
    </TableRow>
    <TableRow align="right" flex>
      <FilledButton :click="viewApplicationDetails" slim type="primary">View Details</FilledButton>
    </TableRow>
  </tr>
</template>

<style scoped></style>
