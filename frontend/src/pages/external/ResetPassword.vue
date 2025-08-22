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
            <AuthErrors />
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
import AuthErrors from '@/components/AuthErrors.vue';

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
        authStore.auth_errors = [
            {
                message: 'New passwords do not match.',
                code: 'password_mismatch',
                param: 'password',
            }
        ];
        return;
    }
    await authStore.resetPassword(props.code, password.value);
};
</script>