<script setup>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'

const { result, loading, error } = useQuery(gql`
      query getUsers {
        users {
          id
          username
        }
      }
    `, null, {
  pollInterval: 5000
})

const users = computed(() => result.value?.users)
</script>

<template>
  <h1 v-if="loading">Loading</h1>
  <ul v-else-if="users">
    <li v-for="user in users" :key="user.id">
      {{ user.username }} - {{ user.id }}
    </li>
  </ul>
</template>

<style scoped>

</style>