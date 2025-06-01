<template>
    <div>
        <h2>Request Password Reset</h2>
        <form @submit.prevent="submitRequestPasswordReset">
            <label>
                Email:
                <input v-model="email" type="email" required />
            </label>
            <br />
            <button type="submit" :disabled="loading">Request Reset</button>
            <span v-if="loading" style="margin-left: 10px;">Loading...</span>
            <ul v-if="authStore.auth_errors && Array.isArray(authStore.auth_errors)">
                <li v-for="(error, index) in authStore.auth_errors" :key="index" style="color:red">{{ error }}</li>
            </ul>
            <p v-else-if="authStore.auth_errors" style="color:red">{{ authStore.auth_errors }}</p>
            <p v-if="successMessage" style="color:green">{{ successMessage }}</p>
        </form>

        <p>
            <router-link to="/login">Back to Login</router-link>
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAllAuthStore } from '@/stores/allauth';

const email = ref('');
const authStore = useAllAuthStore();
const loading = computed(() => authStore.loading);
const successMessage = ref('');

const submitRequestPasswordReset = async () => {
    successMessage.value = '';
    await authStore.requestPasswordReset(email.value);
    if (!authStore.auth_errors) {
        successMessage.value = 'If this email exists, a password reset link has been sent.';
    }
};
</script>
