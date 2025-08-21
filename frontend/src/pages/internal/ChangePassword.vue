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
            <AuthErrors />
            <p v-if="successMessage" style="color:green">{{ successMessage }}</p>
        </form>
        <router-link to="/">Back to Profile</router-link>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import AuthErrors from '@/components/AuthErrors.vue';

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const authStore = useUserStore();
const loading = computed(() => authStore.loading);
const successMessage = ref('');

const submitChangePassword = async () => {
    successMessage.value = '';
    if (newPassword.value !== confirmPassword.value) {
        authStore.auth_errors = [
            {
                message: 'New passwords do not match.',
                code: 'password_mismatch',
                param: 'password',
            }
        ];
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
