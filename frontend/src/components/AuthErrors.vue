<template>
  <div v-if="errors && errors.length">
    <ul>
      <li v-for="(error, index) in normalizedErrors" :key="index" style="color:red">{{ error }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue'
import { useAllAuthStore } from '@/stores/user'

// Access the store
const authStore = useAllAuthStore()

// Reset auth errors on component mount
onMounted(() => {
    authStore.resetAuthErrors()
})

const errors = computed(() => authStore.auth_errors)

const normalizedErrors = computed(() => {
  if (!errors.value) return []
  if (Array.isArray(errors.value)) {
    return errors.value.map(e => (typeof e === 'string' ? e : (e as AuthError)?.message || 'Unknown error'));
  }
  return [errors.value] // single string
})
</script>
