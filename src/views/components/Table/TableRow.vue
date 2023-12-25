<script setup>
defineProps({
  align: {
    type: String,
    default: 'left',
    validator: (value) => {
      return ['left', 'center', 'right'].includes(value)
    }
  }
})
</script>

<template>
  <td
    :class="{
      'text-left': align === 'left',
      'text-center': align === 'center',
      'text-right': align === 'right'
    }"
    class="whitespace-nowrap px-4 py-4">
    <slot></slot>
  </td>
</template>
