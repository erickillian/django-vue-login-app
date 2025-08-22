<template>
  <h1>Edit User Info</h1>
  <form @submit.prevent="saveChanges">
    <div v-for="field in fields" :key="field.key">
      <label :for="field.key">{{ field.label }}:</label>

      <!-- Render input based on field type -->
      <input
        v-if="field.type === 'text'"
        :id="field.key"
        v-model="form[field.key]"
        type="text"
      />

      <select
        v-else-if="field.type === 'select'"
        :id="field.key"
        v-model="form[field.key]"
      >
        <option v-for="option in field.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Display errors -->
      <div v-if="userErrors[field.key]" class="error">
        <p v-for="(err, index) in userErrors[field.key]" :key="index">{{ err }}</p>
      </div>
    </div>

    <button type="submit" :disabled="loading">Save</button>
  </form>

  <div v-if="loading">Loading...</div>
  <router-link to="/">Back to Profile</router-link>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const authStore = useUserStore()

const loading = computed(() => authStore.loading)
const userErrors = computed(() => authStore.user_self_errors || {})

// Define the editable fields
const fields = [
  { key: 'full_name', label: 'Full Name', type: 'text' },
  {
    key: 'color_mode',
    label: 'Color Mode',
    type: 'select',
    options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' },
    ],
  },
]

const form = reactive<Record<string, any>>({})

onMounted(async () => {
  if (!authStore.user_self) {
    await authStore.getUserInfo()
  }
  if (authStore.user_self) {
    // Initialize form dynamically from fields
    fields.forEach(f => {
      form[f.key] = authStore.user_self[f.key] ?? ''
    })
  }
})

const saveChanges = async () => {
  await authStore.updateUser(form)
}
</script>
