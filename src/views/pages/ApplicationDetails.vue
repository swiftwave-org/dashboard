<script setup>

import { useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'
import Badge from '@/views/components/Badge.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ApplicationDetailsNavbar from '@/views/partials/ApplicationDetailsNavbar.vue'
import NewApplicationUpdaterStore from '@/store/applicationUpdater.js'
import FilledButton from '@/views/components/FilledButton.vue'

// Get the application ID from the URL
const router = useRouter()
const applicationId = router.currentRoute.value.params.id

// Fetch the application details
const {
  result: applicationDetailsRaw,
  loading: applicationDetailsLoading
} = useQuery(gql`
  query ($id: String!) {
    application(id: $id) {
      id
      name
      isDeleted
      deploymentMode
      replicas
      realtimeInfo{
        InfoFound
        DesiredReplicas
        RunningReplicas
        DeploymentMode
      }
      latestDeployment{
        id
        status
        upstreamType
        dockerImage
        gitProvider
        repositoryName
        repositoryOwner
        repositoryBranch
        codePath
        createdAt
      }
      deployments {
        id
        status
        createdAt
      }
    }
  }
`, {
  id: applicationId
}, {
  pollInterval: 10000
})

const applicationDetails = computed(() => applicationDetailsRaw.value?.application ?? {})
const lastDeployedOn = computed(() => {
  const date = new Date(applicationDetailsRaw.value?.application?.latestDeployment?.createdAt)
  return date.toLocaleString()
})
const realtimeInfo = computed(() => applicationDetailsRaw.value?.application?.realtimeInfo ?? {})
const realtimeReplicaCountPercentage = computed(() => {
  try {
    return (realtimeInfo.value.RunningReplicas / realtimeInfo.value.DesiredReplicas) * 100
  } catch (e) {
    return 0
  }
})

// Environment variables editor
const applicationUpdater = NewApplicationUpdaterStore(applicationId)()

</script>

<template>

  <div v-if="applicationDetailsLoading">
    <p>Loading...</p>
  </div>
  <section v-else class="mx-auto w-full max-w-7xl">
    <div class="flex flex-row justify-between">
      <!--   left side   -->
      <div>
        <div class="flex items-center gap-2">
          <p class="font-medium text-xl">{{ applicationDetails.name }}</p>
          <Badge v-if="applicationDetails.latestDeployment.status === 'live'" type="success">
            {{ applicationDetails.latestDeployment.status }}
          </Badge>
          <Badge v-else-if="applicationDetails.latestDeployment.status === 'pending'" type="warning">
            {{ applicationDetails.latestDeployment.status }}
          </Badge>
          <Badge v-else-if="applicationDetails.latestDeployment.status === 'deployPending'" type="warning">
            {{ applicationDetails.latestDeployment.status }}
          </Badge>
          <Badge v-else-if="applicationDetails.latestDeployment.status === 'deploying'" type="warning">
            {{ applicationDetails.latestDeployment.status }}
          </Badge>
          <Badge v-else-if="applicationDetails.latestDeployment.status === 'failed'" type="danger">
            {{ applicationDetails.latestDeployment.status }}
          </Badge>
          <Badge v-else-if="applicationDetails.latestDeployment.status === 'stopped'" type="secondary">
            {{ applicationDetails.latestDeployment.status }}
          </Badge>
          <Badge v-else-if="applicationDetails.latestDeployment.status === 'stalled'" type="secondary">
            {{ applicationDetails.latestDeployment.status }}
          </Badge>
        </div>
        <div class="flex items-center gap-2 font-medium text-gray-800 mt-2">
          <font-awesome-icon v-if="applicationDetails.latestDeployment.upstreamType === 'git'"
                             icon="fa-solid fa-code-branch" />
          <font-awesome-icon v-if="applicationDetails.latestDeployment.upstreamType === 'image'"
                             icon="fa-brands fa-docker" />
          <font-awesome-icon v-if="applicationDetails.latestDeployment.upstreamType === 'sourceCode'"
                             icon="fa-solid fa-upload" />

          <p v-if="applicationDetails.latestDeployment.upstreamType === 'git'">
            {{ applicationDetails.latestDeployment.gitProvider }}@{{ applicationDetails.latestDeployment.repositoryOwner
            }}/{{ applicationDetails.latestDeployment.repositoryName
            }}:{{ applicationDetails.latestDeployment.repositoryBranch }}</p>
          <p v-if="applicationDetails.latestDeployment.upstreamType === 'image'">
            {{ applicationDetails.latestDeployment.dockerImage }}</p>
          <p v-if="applicationDetails.latestDeployment.upstreamType === 'sourceCode'">Source-code uploaded manually</p>
        </div>
        <div class="flex items-center gap-2 font-normal text-gray-800 mt-2">
          <font-awesome-icon icon="fa-solid fa-calendar-days" />
          <p>{{ lastDeployedOn }}</p>
        </div>
        <div class="flex items-center gap-2 font-normal text-gray-800 mt-2">
          <font-awesome-icon icon="fa-solid fa-gear" />
          <p v-if="applicationDetails.deploymentMode === 'global'">Global Deployment</p>
          <p v-else-if="applicationDetails.deploymentMode === 'replicated'">Replicated Deployment (expected
            {{ applicationDetails.replicas }} instance of the application)</p>
        </div>
      </div>
      <!--   right side   -->
      <div class="flex flex-col items-end">
        <p class="font-medium text-xl">Realtime Info</p>
        <div class="flex items-center gap-2 text-gray-800 mt-2 font-medium">
          <p v-if="realtimeInfo.InfoFound" class="text-center">Active {{ realtimeInfo.RunningReplicas }} instance(s)
            <br>
            <span
              :class="{
              'text-success-600': realtimeReplicaCountPercentage >= 100,
              'text-warning-600': realtimeReplicaCountPercentage < 100 && realtimeReplicaCountPercentage > 0,
              'text-danger-600': realtimeReplicaCountPercentage === 0
            }"
              class="font-bold"

            >[{{ realtimeReplicaCountPercentage }}%]</span>
          </p>
          <p v-else class="text-warning-600">
            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />&nbsp;&nbsp;Not Available
          </p>
        </div>
      </div>
    </div>

    <hr class="mt-4">

    <!--  Horizontal navbar for links    -->
    <ApplicationDetailsNavbar class="mt-4 mb-4" />

    <!--  Nested Router View  -->
    <RouterView />

    <!--  Update Config Notify bar  -->
    <div
      v-if="applicationUpdater.isConfigurationUpdated"
      class="mt-4 flex flex-row justify-end gap-2 items-center  border border-gray-300 p-2 rounded-md">
      <span class="font-medium mr-4">You have updated some of the configuration</span>
      <FilledButton
        type="primary"
        :loading="applicationUpdater.isDeployRequestSubmitting"
        :click="applicationUpdater.applyConfigurationChanges"
      >
        Apply Changes
      </FilledButton>
      <FilledButton
        type="secondary"
        :disabled="applicationUpdater.isDeployRequestSubmitting"
        :click="applicationUpdater.cancelConfigurationChanges"
      >
        Cancel
      </FilledButton>
    </div>
  </section>

</template>

<style scoped>

</style>