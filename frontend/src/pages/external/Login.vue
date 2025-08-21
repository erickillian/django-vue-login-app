<template>
    <div>
        <router-link :to="{ name: 'ExternalHomePage' }">Back</router-link>
        <h2>Login</h2>
        <form @submit.prevent="login">
            <label>
            Email:
            <input v-model="email" type="text" required />
            </label>
            <br />
            <label>
            Password:
            <input v-model="password" type="password" required />
            </label>
            <br />
            <button type="submit" :disabled="loading">Login</button>
            <span v-if="loading" style="margin-left: 10px;">Loading...</span>
            <AuthErrors />
    </form>
    <router-link :to="{ name: 'ForgotPasswordPage' }">Forgot Password</router-link>
    </div>
  </template>
  
<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useAllAuthStore } from '@/stores/user';
    import AuthErrors from '@/components/AuthErrors.vue';

    const email = ref('');
    const password = ref('');
    const authStore = useAllAuthStore();
    const loading = computed(() => authStore.loading);

    const login = async () => {
        await authStore.login({ email: email.value, password: password.value });
        authStore.handeNextAuthFlowStep();
    };
</script>