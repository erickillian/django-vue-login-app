<template>
  <LoadingPage v-if="showLoading" />
  <router-view v-else />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAllAuthStore } from '@/stores/allauth';
import LoadingPage from '@/pages/loading/LoadingPage.vue';

const showLoading = ref(true);
const auth = useAllAuthStore();
const router = useRouter();

// Check if current route is public
const isPublicRoute = () => {
  const currentRoute = router.currentRoute.value;
  return currentRoute.meta.requiresAuth === false;
};

// Watch for authentication changes
watch(() => auth.isAuthenticated, (newValue, oldValue) => {
    if (oldValue == null) {
        // Initial load, do not redirect
        return;
    }
    // Skip if values are the same or during initial load
    if (newValue === oldValue || showLoading.value) return;
    
    const currentRoute = router.currentRoute.value;
    
    if (newValue) {
        // User just logged in - redirect from public pages to internal home
        if (currentRoute.meta.requiresAuth === false) {
        router.push({ name: 'InternalHomePage' });
        }
    } else {
        // User just logged out - redirect from protected pages to login
        if (currentRoute.meta.requiresAuth === true) {
        router.push({ name: 'LoginPage' });
        }
    }
});

onMounted(async () => {
    // Skip authentication check for public routes
    if (isPublicRoute()) {
        showLoading.value = false;
        return;
    }

    try {
        await auth.checkAuthentication();
    } catch (err) {
        console.log('Error checking authentication:', err);
    } finally {
        showLoading.value = false;
    }
});
</script>