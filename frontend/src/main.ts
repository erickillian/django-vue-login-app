import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import router from '@/router';
import { useAllAuthStore } from '@/stores/allauth';
import LoadingPage from '@/pages/loading/LoadingPage.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const auth = useAllAuthStore();

// Show loading screen while checking authentication
const loadingApp = createApp(LoadingPage);
loadingApp.mount('#app');

// Wait for authentication check before mounting main app
auth.checkAuthentication()
    .then(() => {
        const route = router.currentRoute.value;

        // Handle initial routing based on auth state
        if (!auth.isAuthenticated && route.meta.requiresAuth) {
            router.replace({ name: 'ExternalHomePage' });
        } else if (auth.isAuthenticated && !route.meta.requiresAuth) {
            router.replace({ name: 'InternalHomePage' });
        }
    })
    .catch(() => {
        // If authentication check fails, ensure user is logged out
        auth.logout();
        router.replace({ name: 'ExternalHomePage' });
    })
    .finally(() => {
        // Unmount loading screen and mount main app
        loadingApp.unmount();
        app.mount('#app');

        // Watch for authentication state changes and redirect accordingly
        auth.$subscribe((mutation, state) => {
            const currentRoute = router.currentRoute.value;

            if (!state.isAuthenticated && currentRoute.meta.requiresAuth) {
                router.replace({ name: 'ExternalHomePage' });
            } else if (state.isAuthenticated && !currentRoute.meta.requiresAuth) {
                router.replace({ name: 'InternalHomePage' });
            }
        });
    });
