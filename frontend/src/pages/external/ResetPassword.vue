<template>
    <div>
        <h2>Reset Password</h2>
        <form @submit.prevent="submitResetPassword">
            <label>
                New Password:
                <input v-model="password" type="password" required />
            </label>
            <br />
            <label>
                Confirm Password:
                <input v-model="confirmPassword" type="password" required />
            </label>
            <br />
            <button type="submit" :disabled="loading">Reset Password</button>
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
import { useUserStore } from '@/stores/user';

interface Props {
    code: string;
}

const props = defineProps<Props>();
console.log(props.code); // Debugging line to check the key value

const password = ref('');
const confirmPassword = ref('');
const authStore = useUserStore();
const loading = computed(() => authStore.loading);
const successMessage = ref('');

const submitResetPassword = async () => {
    successMessage.value = '';
    if (password.value !== confirmPassword.value) {
        authStore.auth_errors = ['Passwords do not match.'];
        return;
    }
    await authStore.resetPassword(props.code, password.value);
    authStore.handeNextAuthFlowStep();
};
</script>