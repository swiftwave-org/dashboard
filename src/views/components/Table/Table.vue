<template>
  <div class="scrollbox max-h-[80vh] overflow-y-auto border border-gray-200 md:rounded-lg">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <slot name="header"></slot>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <slot name="body"></slot>
      </tbody>
    </table>
    <slot name="message"></slot>
  </div>
</template>

<style scoped>
.scrollbox::-webkit-scrollbar {
  width: 9px;
}

.scrollbox::-webkit-scrollbar-track {
  @apply rounded-full bg-gray-200;
}

.scrollbox::-webkit-scrollbar-thumb {
  @apply rounded-full bg-primary-500;
}
</style>
