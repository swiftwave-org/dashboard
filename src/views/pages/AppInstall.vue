<!--suppress ALL -->
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { parse } from 'yaml'
import { useToast } from 'vue-toastification'
import DotLoader from '@/views/components/DotLoader.vue'
import MarkdownRenderer from '@/views/components/MarkdownRenderer.vue'
import FilledButton from '@/views/components/FilledButton.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const stackUrl = route.query.stack
const stackDetails = ref(null)
const isLoadingStack = ref(true)

onMounted(() => {
  if (!stackUrl) {
    router.push({ name: 'App Store' })
  }
  fetchStackDetails()
})

const fetchStackDetails = async () => {
  if (!stackUrl) return
  fetch(stackUrl.toString())
    .then((response) => response.text())
    .then((data) => {
      // parse yaml
      stackDetails.value = parse(data)
      if ('services' in stackDetails.value && 'docs' in stackDetails.value) {
        // check if `iframe_video_embed` have any `<script` tag
        if (stackDetails.value.docs.iframe_video_embed.includes('<script')) {
          throw new Error('Invalid stack file')
        }
        isLoadingStack.value = false
      } else {
        throw new Error('Invalid stack file')
      }
    })
    .catch((error) => {
      console.error(error)
      toast.error('Invalid stack file')
      router.push({ name: 'App Store' })
    })
}
</script>

<template>
  <div v-if="isLoadingStack" class="flex h-full w-full items-center justify-center">
    <DotLoader />
  </div>
  <section v-else class="relative mx-auto mt-2 flex h-full w-full max-w-7xl flex-col items-center overflow-hidden">
    <!--  Header  -->
    <div class="flex w-full flex-row gap-5">
      <!--      Logo -->
      <div class="h-14 w-14 rounded-md border border-primary-500 p-1.5">
        <img :src="stackDetails.docs.logo_url" class="h-full w-full" :alt="stackDetails.docs.name" />
      </div>
      <!--    Title and description    -->
      <div>
        <p class="text-xl font-semibold">{{ stackDetails.docs.name }}</p>
        <p class="text-gray-800">{{ stackDetails.docs.description }}</p>
      </div>
    </div>
    <!--  Iframe Video  -->
    <div class="mt-12" v-if="stackDetails.docs.iframe_video_embed" v-html="stackDetails.docs.iframe_video_embed"></div>
    <!--  Readme description  -->
    <div class="mt-12 w-full" v-if="!stackDetails.docs.readme_description">
      <MarkdownRenderer :source="stackDetails.docs.readme_description" />
    </div>
    <div v-else class="mt-12 w-full">
      <p class="italic text-gray-800">No details available</p>
    </div>
    <!--  Installation Options  -->
    <div class="absolute bottom-0 right-0">
      <div class="flex flex-row items-center justify-center gap-2">
        <p class="font-semibold text-secondary-700">Looking for installation ?</p>
        <FilledButton type="info">
          <font-awesome-icon icon="fa-solid fa-plus" class="mr-2" />
          Install Now
        </FilledButton>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
