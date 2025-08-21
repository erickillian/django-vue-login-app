<template>
    <div>
        <h2>Request Password Reset</h2>
        <form @submit.prevent="submitRequestPasswordReset">
            <label>
                Email:
                <input v-model="email" type="email" :disabled="loading" required />
            </label>
            <br />
            <button type="submit" :disabled="loading">Request Reset</button>
            <span v-if="loading" style="margin-left: 10px;">Loading...</span>
            <AuthErrors />
            <p v-if="successMessage" style="color:green">{{ successMessage }}</p>
        </form>

        <router-link to="/login">Back to Login</router-link>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import AuthErrors from '@/components/AuthErrors.vue';

const email = ref('');
const successMessage = ref('');
const authStore = useUserStore();
const router = useRouter();

const loading = computed(() => authStore.loading);

const submitRequestPasswordReset = async () => {
  successMessage.value = '';
  try {
    await authStore.requestPasswordReset(email.value);

    if (authStore.auth_errors.length > 0) {
      // If there are errors, they will be displayed by AuthErrors component
      return;
    }
    successMessage.value = 'If this email exists, a password reset link has been sent.';

    // Disable form for a short time to let user see success message
    setTimeout(() => {
        successMessage.value = '';
    }, 5000);
  } catch {
    // errors handled by AuthErrors component
  }
};
</script>
