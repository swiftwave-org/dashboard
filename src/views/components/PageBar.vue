<template>
  <div class="flex w-full flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
    <div>
      <h2 class="text-lg font-semibold">
        <slot name="title"></slot>
      </h2>
      <p class="mt-1 text-sm text-gray-700">
        <slot name="subtitle"></slot>
      </p>
    </div>
    <div class="flex flex-row gap-2">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>
