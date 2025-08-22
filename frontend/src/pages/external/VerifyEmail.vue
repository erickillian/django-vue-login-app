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
            <AuthErrors />
        </form>
        <p>
            Didn't get a code? <button @click="resendCode" type="button">Request a new Code</button>
        </p>
        <p v-if="resent" style="color:green">Verification code resent!</p>
    </div>
    <router-link :to="{ name: 'SignUpPage' }">Sign Up</router-link>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import AuthErrors from '@/components/AuthErrors.vue';
import { useRouter } from 'vue-router';

const code = ref('');
const resent = ref(false);
const userStore = useUserStore();
const router = useRouter();

const verifyEmail = async () => {
    try {
        await userStore.verifyEmail(code.value);
        router.push({ name: 'InternalHomePage' });
    } catch (error) {}
};

const resendCode = async () => {
    await userStore.requestEmailVerification();
    resent.value = true;
    setTimeout(() => (resent.value = false), 3000);
};
</script>