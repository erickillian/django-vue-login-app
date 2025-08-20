<template>
  <router-view />
</template>

<script setup>
import { useAllAuthStore } from '@/stores/allauth';
import { watch } from 'vue';
import { setupRoutes } from '@/router';
import { useRouter } from 'vue-router';

const allAuthStore = useAllAuthStore();
const router = useRouter();

// also react to changes (login/logout)
watch(
    () => allAuthStore.isAuthenticated,
    (newVal, oldVal) => {
        if (newVal !== oldVal) {
            setupRoutes(allAuthStore);
            router.push(newVal ? '/' : '/login');
        }
    }
);

</script>