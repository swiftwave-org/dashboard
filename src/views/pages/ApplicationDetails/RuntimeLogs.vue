<script setup>
import 'xterm/css/xterm.css'

import { computed, onMounted, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { Terminal } from 'xterm'
import { useRouter } from 'vue-router'
import { useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { FitAddon } from 'xterm-addon-fit'
import StatusPulse from '@/views/components/StatusPulse.vue'


const toast = useToast()
const router = useRouter()

const showDeploymentLog = ref(false)
const terminal = new Terminal({
  convertEol: true,
  rows: 35
})
const fitAddon = new FitAddon()
terminal.loadAddon(fitAddon)

const {
  result: deploymentLogRaw,
  loading: isDeploymentLogLoading,
  onError: onDeploymentLogError
} = useSubscription(gql`
  subscription ($id: String!) {
    fetchRuntimeLog(applicationId: $id){
      content
    }
  }
`, {
  id: router.currentRoute.value.params.id
}, {
  enabled: showDeploymentLog
})

onDeploymentLogError((err) => {
  toast.error(err.message)
})

const deploymentLog = computed(() => deploymentLogRaw.value?.fetchRuntimeLog.content ?? '')
watch(deploymentLog, (value) => {
  if (value) {
    terminal.write(value)
  }
})


onMounted(() => {
  terminal.open(document.getElementById('terminal_2'))
  fitAddon.fit()
  showDeploymentLog.value = true
})
</script>

<template>
  <p class="font-medium text-lg inline-flex items-center gap-2">Runtime Logs
    <StatusPulse type="success" />
  </p>
  <div id="terminal_2" class="w-full max-w-7xl mt-3"></div>
</template>

<style scoped>

</style>