<template>
    <div>
        <h2>Logging out...</h2>
        <p v-if="loading">Please wait while we log you out.</p>
        <p v-else>You have been logged out. <router-link to="/login">Login again</router-link></p>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAllAuthStore } from '@/stores/user';

const authStore = useAllAuthStore();
const router = useRouter();
const loading = computed(() => authStore.loading);

onMounted(async () => {
    await authStore.logout();
});
</script>
