<script setup>
defineProps({
  type: {
    type: String,
    default: 'primary',
    validator: (value) => {
      return ['primary', 'secondary', 'success', 'danger', 'warning'].includes(value)
    }
  },
  click: {
    type: Function,
    required: false,
    default: () => {}
  }
})
</script>

<template>
  <a
    :class="{
      'text-primary-600': type === 'primary',
      'text-secondary-600': type === 'secondary',
      'text-success-600': type === 'success',
      'text-danger-600': type === 'danger',
      'text-warning-600': type === 'warning'
    }"
    class="cursor-pointer"
    @click.prevent="click">
    <slot></slot>
  </a>
</template>

<style scoped></style>
