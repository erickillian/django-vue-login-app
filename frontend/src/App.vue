<template>
  <router-view />
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { watch } from 'vue';
import { setupRoutes } from '@/router';
import { useRouter } from 'vue-router';

const allAuthStore = useUserStore();
const router = useRouter();

// also react to changes (login/logout)
watch(
    () => allAuthStore.isAuthenticated,
    (newVal, oldVal) => {
        if (newVal !== oldVal) {
            setupRoutes(allAuthStore);
            if (newVal) {
                console.log('User logged in');
                router.push({ name: 'InternalHomePage' })
            } else {
                console.log('User logged out');
                router.push({ name: 'ExternalHomePage' })
            }
            allAuthStore.checkAuthentication();
            router.push(newVal ? '/' : '/login');
        }
    }
);

</script>