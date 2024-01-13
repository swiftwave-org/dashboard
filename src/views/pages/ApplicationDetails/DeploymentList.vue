<script setup>


import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Badge from '@/views/components/Badge.vue'

const router = useRouter()
const toast = useToast()

// Fetch ingress rules
const {
  result: ingressRulesRaw,
  onError: onDeploymentsError
} = useQuery(
  gql`
    query ($id: String!) {
      application(id: $id) {
        deployments {
          id
          status
          upstreamType
          gitProvider
          commitHash
          dockerImage
          repositoryName
          repositoryOwner
          repositoryBranch
          createdAt
        }
      }
    }
  `,
  {
    id: router.currentRoute.value.params.id
  },
  {
    pollInterval: 10000
  }
)

const deployments = computed(() => ingressRulesRaw.value?.application?.deployments ?? [])

onDeploymentsError((err) => {
  toast.error(err.message)
})


const formatdate = (date) => {
  const x = new Date(date)
  return x.toLocaleString()
}

</script>

<template>
  <p
    class="text-gray-900 font-semibold w-full text-center"
  >🛠 Click on a deployment to view more details 🛠</p>
  <div class="flex flex-col mt-4 gap-2 max-h-[60vh] overflow-y-auto px-2 scrollbox">
    <RouterLink
      v-for="deployment in deployments"
      :key="deployment.id"
      :to="{
        name: 'Deployment Details',
        params: {
          id: deployment.id
        }
      }"
      class="w-full"
    >
      <div
        class="border-2 border-gray-500 rounded-md shadow p-4 w-full hover:bg-gray-100 cursor-pointer hover:border-4 hover:border-primary-300 transition-all duration-100 ease-in-out">
        <div class="flex items-center gap-2 font-bold">
          <font-awesome-icon icon="fa-solid fa-fingerprint" />
          <p class="mr-1">{{ deployment.id }}</p>
          <Badge v-if="deployment.status === 'live'" type="success">{{ deployment.status }}</Badge>
          <Badge v-else-if="deployment.status === 'pending'" type="warning">{{ deployment.status }}</Badge>
          <Badge v-else-if="deployment.status === 'deployPending'" type="warning">{{ deployment.status }}</Badge>
          <Badge v-else-if="deployment.status === 'deploying'" type="warning">{{ deployment.status }}</Badge>
          <Badge v-else-if="deployment.status === 'failed'" type="danger">{{ deployment.status }}</Badge>
          <Badge v-else-if="deployment.status === 'stopped'" type="secondary">{{ deployment.status }}</Badge>
          <Badge v-else-if="deployment.status === 'stalled'" type="secondary">{{ deployment.status }}</Badge>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <font-awesome-icon v-if="deployment.upstreamType === 'git'" icon="fa-solid fa-code-branch" />
          <font-awesome-icon v-if="deployment.upstreamType === 'image'" icon="fa-brands fa-docker" />
          <font-awesome-icon v-if="deployment.upstreamType === 'sourceCode'" icon="fa-solid fa-upload" />

          <p v-if="deployment.upstreamType === 'git'">{{ deployment.gitProvider }}@{{ deployment.repositoryOwner
            }}/{{ deployment.repositoryName }}:{{ deployment.repositoryBranch }}</p>
          <p v-if="deployment.upstreamType === 'image'">{{ deployment.dockerImage }}</p>
          <p v-if="deployment.upstreamType === 'sourceCode'">Source-code uploaded manually</p>
        </div>
        <div class="flex items-center gap-2 font-normal">
          <font-awesome-icon icon="fa-solid fa-calendar-days" />
          <p>Deployment triggered on {{ formatdate(deployment.createdAt) }}</p>
        </div>
      </div>
    </RouterLink>
  </div>
  <p class="text-secondary-700 text-sm w-full text-center mt-4">Scroll down to view more deployments(if any)</p>
</template>

<style scoped>
.scrollbox::-webkit-scrollbar {
  width: 12px;
  @apply mx-2;
}

.scrollbox::-webkit-scrollbar-track {
  @apply bg-gray-200 rounded-full;
}

.scrollbox::-webkit-scrollbar-thumb {
  @apply bg-primary-500 rounded-full;
}

</style>
