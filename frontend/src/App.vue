<template>
  <LoadingPage v-if="isLoading" />
  <router-view v-else />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAllAuthStore } from '@/stores/allauth';
import LoadingPage from '@/pages/loading/LoadingPage.vue';

const isLoading = ref(true);
const router = useRouter();
const auth = useAllAuthStore();

// Watch for authentication changes
watch(() => auth.isAuthenticated, (newValue, oldValue) => {
  // Skip if values are the same or during initial load
  if (newValue === oldValue || isLoading.value) return;
  
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
  try {
    await auth.checkAuthentication();
  } catch (err) {
    console.log('Error checking authentication:', err);
  } finally {
    isLoading.value = false;
  }
});
</script>