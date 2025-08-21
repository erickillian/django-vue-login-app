<template>
    <div>
        <h2>Verify Your Email</h2>
        <form @submit.prevent="verifyEmail">
            <label>
                Verification Code:
                <input v-model="code" type="text" required />
            </label>
            <br />
            <button type="submit">Verify Email</button>
            <ul v-if="authStore.auth_errors && Array.isArray(authStore.auth_errors)">
                <li v-for="(error, index) in authStore.auth_errors" :key="index" style="color:red">{{ error }}</li>
            </ul>
            <p v-else-if="authStore.auth_errors" style="color:red">{{ authStore.auth_errors }}</p>
        </form>
        <p>
            Didn't get a code? <button @click="resendCode" type="button">Request a new Code</button>
        </p>
        <p v-if="resent" style="color:green">Verification code resent!</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const code = ref('');
const resent = ref(false);
const authStore = useUserStore();

const verifyEmail = async () => {
    await authStore.verifyEmail(code.value);
    authStore.handeNextAuthFlowStep();
};

const resendCode = async () => {
    await authStore.requestEmailVerification();
    authStore.handeNextAuthFlowStep();
    resent.value = true;
    setTimeout(() => (resent.value = false), 3000);
};
</script>