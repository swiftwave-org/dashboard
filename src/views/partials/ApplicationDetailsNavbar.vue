<script setup>
</script>

<template>
  <div class="flex flex-row flex-wrap select-none">
    <RouterLink :to="{
      name: 'Application Details Deployments',
      params: { id: $route.params.id }
    }">
      <div  class="px-3 py-2 border border-black text-sm font-medium hover:bg-gray-200 min-w-max">
        Deployments
      </div>
    </RouterLink>
    <RouterLink
      :to="{
        name: 'Application Details Runtime Logs',
        params: { id: $route.params.id }
      }">
      <div  class="px-3 py-2 border border-black text-sm font-medium hover:bg-gray-200 min-w-max">
        Runtime Logs
      </div>
    </RouterLink>
    <RouterLink
      :to="{
        name: 'Application Details Ingress Rules',
        params: { id: $route.params.id }
      }">
      <div  class="px-3 py-2 border border-black text-sm font-medium hover:bg-gray-200 min-w-max">
        Ingress Rules
      </div>
    </RouterLink>
    <RouterLink
      :to="{
        name: 'Application Details Update Source',
        params: { id: $route.params.id }
      }">
      <div  class="px-3 py-2 border border-black text-sm font-medium hover:bg-gray-200 min-w-max">
        Update Source Code
      </div>
    </RouterLink>
    <RouterLink
      :to="{
        name: 'Application Details Environment Variables',
        params: { id: $route.params.id }
      }">
      <div  class="px-3 py-2 border border-black text-sm font-medium hover:bg-gray-200 min-w-max">
        Environment Variables
      </div>
    </RouterLink>
    <RouterLink
      :to="{
        name: 'Application Details Persistent Volumes',
        params: { id: $route.params.id }
      }">
      <div  class="px-3 py-2 border border-black text-sm font-medium hover:bg-gray-200 min-w-max">
        Persistent Volumes
      </div>
    </RouterLink>
    <RouterLink
      :to="{
        name: 'Application Details Deployment Config',
        params: { id: $route.params.id }
      }"
    >
      <div  class="px-3 py-2 border border-black text-sm font-medium hover:bg-gray-200 min-w-max">
        Deployment Configuration
      </div>
    </RouterLink>
    <RouterLink
      :to="{
        name: 'Application Details Webhook CI',
        params: { id: $route.params.id }
      }"
    >
      <div  class="px-3 py-2 border border-black text-sm font-medium hover:bg-gray-200 min-w-max">
        Webhook CI
      </div>
    </RouterLink>
    <RouterLink
      :to="{
        name: 'Application Details Danger Zone',
        params: { id: $route.params.id }
      }"
    >
      <div  class="px-3 py-2 border border-black text-sm font-medium hover:bg-gray-200 min-w-max">
        <font-awesome-icon icon="fa-solid fa-skull-crossbones" />
        Danger Zone
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  @apply bg-amber-300;
}

.router-link-exact-active :hover {
  @apply bg-amber-300;
}
</style>