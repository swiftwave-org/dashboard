<script setup>
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'
import Badge from '@/views/components/Badge.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ApplicationDetailsNavbar from '@/views/partials/ApplicationDetailsNavbar.vue'
import NewApplicationUpdaterStore from '@/store/applicationUpdater.js'
import FilledButton from '@/views/components/FilledButton.vue'
import { useToast } from 'vue-toastification'

// Toast
const toast = useToast()

// Get the application ID from the URL
const router = useRouter()
const applicationId = router.currentRoute.value.params.id

// Fetch the application details
const {
  result: applicationDetailsRaw,
  loading: applicationDetailsLoading,
  refetch: refetchApplicationDetails
} = useQuery(
  gql`
    query ($id: String!) {
      application(id: $id) {
        id
        name
        isDeleted
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
      }
    }
  `,
  {
    id: applicationId
  },
  {
    pollInterval: 10000
  }
)

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

// App Doze Mode
const {
  mutate: sleepApplication,
  loading: sleepApplicationLoading,
  onDone: onSleepApplicationDone,
  onError: onSleepApplicationError
} = useMutation(
  gql`
    mutation ($id: String!) {
      sleepApplication(id: $id)
    }
  `,
  {
    variables: {
      id: applicationId
    }
  }
)

onSleepApplicationDone(() => {
  toast.success('Application will be paused in a few seconds')
  refetchApplicationDetails()
})

onSleepApplicationError((error) => {
  toast.error(error.message)
})

const {
  mutate: wakeApplication,
  loading: wakeApplicationLoading,
  onDone: onWakeApplicationDone,
  onError: onWakeApplicationError
} = useMutation(
  gql`
    mutation ($id: String!) {
      wakeApplication(id: $id)
    }
  `,
  {
    variables: {
      id: applicationId
    }
  }
)

onWakeApplicationDone(() => {
  toast.success('Application will be resumed in a few seconds')
  refetchApplicationDetails()
})

onWakeApplicationError((error) => {
  toast.error(error.message)
})
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
          <p class="text-xl font-medium">{{ applicationDetails.name }}</p>
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
          <Badge v-if="applicationDetails.isSleeping" type="warning"> Sleeping</Badge>
        </div>
        <div class="mt-2 flex items-center gap-2 font-medium text-gray-800">
          <font-awesome-icon
            v-if="applicationDetails.latestDeployment.upstreamType === 'git'"
            icon="fa-solid fa-code-branch" />
          <font-awesome-icon
            v-if="applicationDetails.latestDeployment.upstreamType === 'image'"
            icon="fa-brands fa-docker" />
          <font-awesome-icon
            v-if="applicationDetails.latestDeployment.upstreamType === 'sourceCode'"
            icon="fa-solid fa-upload" />

          <p v-if="applicationDetails.latestDeployment.upstreamType === 'git'">
            {{ applicationDetails.latestDeployment.gitProvider }}@{{
              applicationDetails.latestDeployment.repositoryOwner
            }}/{{ applicationDetails.latestDeployment.repositoryName }}:{{
              applicationDetails.latestDeployment.repositoryBranch
            }}
          </p>
          <p v-if="applicationDetails.latestDeployment.upstreamType === 'image'">
            {{ applicationDetails.latestDeployment.dockerImage }}
          </p>
          <p v-if="applicationDetails.latestDeployment.upstreamType === 'sourceCode'">Source-code uploaded manually</p>
        </div>
        <div class="mt-2 flex items-center gap-2 font-normal text-gray-800">
          <font-awesome-icon icon="fa-solid fa-calendar-days" />
          <p>{{ lastDeployedOn }}</p>
        </div>
        <div class="mt-2 flex items-center gap-2 font-normal text-gray-800">
          <font-awesome-icon icon="fa-solid fa-gear" />
          <p v-if="applicationDetails.deploymentMode === 'global'">Global Deployment</p>
          <p v-else-if="applicationDetails.deploymentMode === 'replicated'">
            Replicated Deployment (expected {{ applicationDetails.replicas }} instance of the application)
          </p>
        </div>
      </div>
      <!--   right side   -->
      <div class="flex flex-col items-end">
        <p class="text-xl font-medium">Realtime Info</p>
        <div class="mt-2 flex items-center gap-2 font-medium text-gray-800">
          <p v-if="applicationDetails.isSleeping" class="font-semibold text-blue-600">
            <font-awesome-icon icon="fa-solid fa-moon" />
            Sleeping
          </p>
          <p v-else-if="realtimeInfo.InfoFound" class="text-center">
            Active {{ realtimeInfo.RunningReplicas }} instance(s)
            <br />
            <span
              :class="{
                'text-success-600': realtimeReplicaCountPercentage >= 100,
                'text-warning-600': realtimeReplicaCountPercentage < 100 && realtimeReplicaCountPercentage > 0,
                'text-danger-600': realtimeReplicaCountPercentage === 0
              }"
              class="font-bold"
              >[{{ realtimeReplicaCountPercentage }}%]</span
            >
          </p>
          <p v-else class="text-warning-600">
            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />&nbsp;&nbsp;Not Available
          </p>
        </div>
        <div class="mt-3">
          <FilledButton
            v-if="applicationDetails.isSleeping"
            class="w-full"
            type="primary"
            :loading="wakeApplicationLoading"
            :click="wakeApplication"
            :disabled="applicationDetails.latestDeployment.status !== 'live'">
            <font-awesome-icon class="mr-2" icon="fa-solid fa-play" />
            Resume App
          </FilledButton>
          <FilledButton
            v-else
            class="w-full"
            type="primary"
            :loading="sleepApplicationLoading"
            :click="sleepApplication"
            :disabled="applicationDetails.latestDeployment.status !== 'live'">
            <font-awesome-icon class="mr-2" icon="fa-solid fa-circle-stop" />
            Pause App
          </FilledButton>
        </div>
      </div>
    </div>

    <hr class="mt-2" />

    <!--  Horizontal navbar for links    -->
    <ApplicationDetailsNavbar class="mb-4 mt-4" />

    <!--  Nested Router View  -->
    <RouterView />

    <!--  Update Config Notify bar  -->
    <div
      v-if="applicationUpdater.isConfigurationUpdated"
      class="mt-4 flex flex-row items-center justify-end gap-2 rounded-md border border-gray-300 p-2">
      <span class="mr-4 font-medium">You have updated some of the configuration</span>
      <FilledButton
        :click="applicationUpdater.applyConfigurationChanges"
        :loading="applicationUpdater.isDeployRequestSubmitting"
        type="primary">
        Apply Changes
      </FilledButton>
      <FilledButton
        :click="applicationUpdater.cancelConfigurationChanges"
        :disabled="applicationUpdater.isDeployRequestSubmitting"
        type="secondary">
        Cancel
      </FilledButton>
    </div>
  </section>
</template>

<style scoped></style>
