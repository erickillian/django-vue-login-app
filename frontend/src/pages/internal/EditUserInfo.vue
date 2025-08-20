<template>
  <div>
    <h1>Edit User Info</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="!user_self">No user info available.</div>
    <div v-else>
      <div v-if="auth_errors.length">
        <ul>
          <li v-for="(error, i) in auth_errors" :key="i">{{ error }}</li>
        </ul>
      </div>

      <form @submit.prevent="saveChanges">
        <div>
          <label for="full_name">Full Name:</label>
          <input id="full_name" v-model="form.full_name" type="text" />
        </div>

        <div>
          <label for="color_mode">Color Mode:</label>
          <select id="color_mode" v-model="form.color_mode">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue'
import { useAllAuthStore } from '@/stores/allauth'

const authStore = useAllAuthStore()

const user_self = computed(() => authStore.user_self)
const auth_errors = computed(() => authStore.auth_errors)
const loading = computed(() => authStore.loading)

const form = reactive({
  full_name: '',
  color_mode: 'system',
})

onMounted(async () => {
    await authStore.getUserInfo()
    if (authStore.user_self) {
        Object.assign(form, authStore.user_self)
    }
})

const saveChanges = async () => {
    authStore.updateUser(form)
}
</script>
