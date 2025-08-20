<template>
    <div>
        <h2>Change Password</h2>
        <form @submit.prevent="submitChangePassword">
            <label>
                Current Password:
                <input v-model="currentPassword" type="password" required />
            </label>
            <br />
            <label>
                New Password:
                <input v-model="newPassword" type="password" required />
            </label>
            <br />
            <label>
                Confirm New Password:
                <input v-model="confirmPassword" type="password" required />
            </label>
            <br />
            <button type="submit" :disabled="loading">Change Password</button>
            <span v-if="loading" style="margin-left: 10px;">Loading...</span>
            <ul v-if="authStore.auth_errors && Array.isArray(authStore.auth_errors)">
                <li v-for="(error, index) in authStore.auth_errors" :key="index" style="color:red">{{ error }}</li>
            </ul>
            <p v-else-if="authStore.auth_errors" style="color:red">{{ authStore.auth_errors }}</p>
            <p v-if="successMessage" style="color:green">{{ successMessage }}</p>
        </form>

        <p>
            <router-link to="/profile">Back to Profile</router-link>
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAllAuthStore } from '@/stores/allauth';

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const authStore = useAllAuthStore();
const loading = computed(() => authStore.loading);
const successMessage = ref('');

const submitChangePassword = async () => {
    successMessage.value = '';
    if (newPassword.value !== confirmPassword.value) {
        authStore.auth_errors = ['New passwords do not match.'];
        return;
    }
    await authStore.changePassword({
        current_password: currentPassword.value,
        new_password: newPassword.value,
    });
    if (!authStore.auth_errors) {
        successMessage.value = 'Password changed successfully.';
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
    }
};
</script>
