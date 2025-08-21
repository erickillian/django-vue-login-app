<template>
    <div>
        <h2>Verify Your Email</h2>
        <form @submit.prevent="verifyEmail">
            <label>
                Verification Code:
                <input v-model="code" type="text" required />
            </label>
            <button type="submit">Verify Email</button>
        </form>
        <AuthErrors />
        <button @click="goBack">Back</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import AuthErrors from '@/components/AuthErrors.vue'

const code = ref('');
const authStore = useUserStore();
const router = useRouter();

const verifyEmail = async () => {
    try {
        await authStore.verifyEmail(code.value);
        router.push({ name: 'EditEmailPage' });
    } catch (error) {}
};
const goBack = () => {
    router.push({ name: 'EditEmailPage' });
};

</script>