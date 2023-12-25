<template>
  <div class="overflow-hidden border border-gray-200 md:rounded-lg">
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
  </div>
</template>
