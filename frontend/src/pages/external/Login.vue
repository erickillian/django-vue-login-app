<template>
    <div>
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
        <ul v-if="authStore.auth_errors && Array.isArray(authStore.auth_errors)">
          <li v-for="(error, index) in authStore.auth_errors" :key="index" style="color:red">{{ error }}</li>
        </ul>
        <p v-else-if="authStore.auth_errors" style="color:red">{{ authStore.auth_errors }}</p>
    </form>
    <p>
        <router-link to="/forgot-password">Forgot your password?</router-link>
    </p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useAllAuthStore } from '@/stores/allauth';

  const email = ref('');
  const password = ref('');
  const authStore = useAllAuthStore();
  const loading = computed(() => authStore.loading);

  const login = async () => {
      await authStore.login({ email: email.value, password: password.value });
      authStore.handeNextAuthFlowStep();
  };
</script>