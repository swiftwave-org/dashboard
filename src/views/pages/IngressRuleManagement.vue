<script setup>
import PageBar from '@/views/components/PageBar.vue'
import FilledButton from '@/views/components/FilledButton.vue'
import { computed, ref } from 'vue'
import CreateIngressRuleModal from '@/views/partials/CreateIngressRuleModal.vue'
import IngressRuleList from '@/views/partials/IngressRuleList.vue'

// Create new ingress rule
const newIngressRuleModalRef = ref(null)
const openNewIngressRuleModal = computed(() => newIngressRuleModalRef.value?.openModal ?? (() => {}))

// Ingress Rules List
const ingressRuleListRef = ref(null)
const refetchIngressRuleList = computed(() => ingressRuleListRef.value?.refetchIngressRules ?? (() => {}))
</script>

<template>
  <section class="mx-auto w-full max-w-7xl">
    <!-- Modal for create persistent volumes -->
    <CreateIngressRuleModal :callback-on-create="refetchIngressRuleList" ref="newIngressRuleModalRef" />
    <!-- Top Page bar   -->
    <PageBar>
      <template v-slot:title>Ingress Rules</template>
      <template v-slot:subtitle>Manage Ingress Rules</template>
      <template v-slot:buttons>
        <FilledButton :click="openNewIngressRuleModal" type="primary">Add New</FilledButton>
      </template>
    </PageBar>
    <!--  Ingress Rule List  -->
    <IngressRuleList class="mt-4" ref="ingressRuleListRef" />
  </section>
</template>

<style scoped></style>
