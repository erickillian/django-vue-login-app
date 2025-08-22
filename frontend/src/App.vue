<template>
  <router-view />
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { watch } from 'vue';
import { setupRoutes } from '@/router';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

setupRoutes(userStore);

// change the routes based on authentication state
watch(
    () => userStore.isAuthenticated,
    (newVal, oldVal) => {
        if (newVal !== oldVal) {
            setupRoutes(userStore);
            if (newVal) {
                router.push({ name: 'InternalHomePage' })
            } else {
                router.push({ name: 'ExternalHomePage' })
            }
            userStore.checkAuthentication();
            router.push(newVal ? '/' : '/login');
        }
    }
);

</script>