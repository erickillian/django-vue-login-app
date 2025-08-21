<template>
    <h1>Edit User Info</h1>
    <div v-if="loading">Loading...</div>
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
    <router-link to="/">Back to Profile</router-link>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const authStore = useUserStore()
const loading = computed(() => authStore.loading)

const form = reactive({
  full_name: '',
  color_mode: '',
})

onMounted(async () => {
    if (!authStore.user_self) {
        await authStore.getUserInfo()
    }
    Object.assign(form, authStore.user_self)
})

const saveChanges = async () => {
    authStore.updateUser(form)
}
</script>
