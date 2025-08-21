import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import router, { setupRoutes } from './router';
import { useUserStore } from '@/stores/user';
import App from './App.vue';
import { watch } from 'vue';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);

const authStore = useUserStore();
setupRoutes(authStore);

if (authStore.isAuthenticated) {
    authStore.checkAuthentication();
}

// also react to changes (login/logout)
watch(
    () => authStore.isAuthenticated,
    (newVal, oldVal) => {
        if (newVal !== oldVal) {
            setupRoutes(authStore);
        }
    }
);

app.use(router);
app.mount('#app');
