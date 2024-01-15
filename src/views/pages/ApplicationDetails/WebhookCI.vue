<script setup>

import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'
import { useToast } from 'vue-toastification'
import FilledButton from '@/views/components/FilledButton.vue'

const router = useRouter()
const toast = useToast()
const applicationId = router.currentRoute.value.params.id

const {
  result: applicationDetailsRaw,
  loading: applicationDetailsLoading,
  refetch: refetchApplicationDetails
} = useQuery(gql`
query ($id: String!) {
  application(id: $id) {
    id
    webhookToken
  }
}
`, {
  id: applicationId
}, {
  fetchPolicy: 'no-cache',
  nextFetchPolicy: 'no-cache'
})

const webhookTriggerLink = computed(() => {
  if(applicationDetailsLoading.value) return 'Loading...'
  if (applicationDetailsRaw.value?.application?.webhookToken) {
    let token = applicationDetailsRaw.value?.application?.webhookToken ?? ''
    return location.origin + '/webhook/redeploy-app/' + applicationId + '/' + token
  } else {
    return 'Loading...'
  }
})

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
  toast.success('Webhook link copied to clipboard !')
}

// Regenerate Webhook Token
const {
  mutate: regenerateWebhookToken,
  loading: regenerateWebhookTokenLoading,
  onError: regenerateWebhookTokenError,
  onDone: regenerateWebhookTokenDone
} = useMutation(gql`
  mutation ($id: String!) {
    regenerateWebhookToken(id: $id)
  }
`, {
  fetchPolicy: 'no-cache',
  nextFetchPolicy: 'no-cache'
})

regenerateWebhookTokenError((error) => {
  toast.error(error.message)
})

regenerateWebhookTokenDone((result) => {
  if (result.data.regenerateWebhookToken) {
    toast.success('Webhook token regenerated successfully !')
    refetchApplicationDetails()
  } else {
    toast.error('Something went wrong !')
  }
})

const regenerateWebhookTokenWithConfirmation = () => {
  if (confirm('Are you sure you want to regenerate the webhook token ?\n\nThis will invalidate the previous token and you will have to update the webhook link in your git/docker repository.')) {
    regenerateWebhookToken({
      id: applicationId
    })
  }
}

</script>

<template>
  <!--  NOTE -->
  <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-8" role="alert">
    <p class="font-bold">NOTE:</p>
    <p>Webhook CI is only available for applications deployed using git/docker</p>
  </div>

  <p class="font-medium text-lg inline-flex items-center gap-2">Webhook Based CI</p>
  <p class="text-sm text-gray-500">You can configure your git/docker repository to trigger a new deployment on every
    push.</p>

  <!--  Link with a copy button -->
  <div class="mt-6">
    <div class="flex flex-row items-center gap-2 relative">
      <input :value="webhookTriggerLink" class="w-full border border-gray-300 rounded-md p-2" readonly type="text">
      <button class="bg-secondary-200 hover:bg-secondary-300 rounded-md absolute right-1 top-1 bottom-1 px-3 text-sm font-bold" @click="copyToClipboard(webhookTriggerLink)">
        Copy <font-awesome-icon icon="fa-solid fa-copy" />
      </button>
    </div>
    <p class="text-sm text-gray-500 mt-2">Copy the above link and paste it in your git/docker repository's webhook
      configuration.</p>
  </div>

  <!-- Regenerate Webhook tolen -->
  <div
    class="w-full flex flex-row justify-between items-center rounded-md mt-6">
    <div>
      <p class="font-medium text-lg inline-flex items-center gap-2">Regenerate Webhook Token</p>
      <p class="text-secondary-700 text-sm">Regenerate the webhook token if you think it is compromised.</p>
    </div>
    <FilledButton
      type="primary"
      :loading="regenerateWebhookTokenLoading"
      @click="regenerateWebhookTokenWithConfirmation"
    >
      Regenerate Token
    </FilledButton>
  </div>


</template>

<style scoped>

</style>