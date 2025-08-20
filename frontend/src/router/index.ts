import { createRouter, createWebHistory } from 'vue-router';
import { useAllAuthStore } from '@/stores/allauth';
import { watch } from 'vue';

// Public routes (no authentication required)
const publicRoutes = [
    {
        path: '/',
        name: 'ExternalHomePage',
        component: () => import('@/pages/external/Home.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: () => import('@/pages/external/Login.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/signup',
        name: 'SignUpPage',
        component: () => import('@/pages/external/SignUp.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/verify-email',
        name: 'VerifyEmailPage',
        component: () => import('@/pages/external/VerifyEmail.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPasswordPage',
        component: () => import('@/pages/external/ForgotPassword.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/reset-password/:code',
        name: 'ResetPasswordPage',
        component: () => import('@/pages/external/ResetPassword.vue'),
        props: (route) => ({ code: route.params.code }),
        meta: { requiresAuth: false }
    },
];

// Internal routes (requires authentication)
const internalRoutes = [
    {
        path: '/home',
        name: 'InternalHomePage',
        component: () => import('@/pages/internal/Home.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/logout',
        name: 'LogoutPage',
        component: () => import('@/pages/internal/Logout.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/change-password',
        name: 'ChangePasswordPage',
        component: () => import('@/pages/internal/ChangePassword.vue'),
        meta: { requiresAuth: true }
    },
];

const routes = [
    ...publicRoutes,
    ...internalRoutes,
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAllAuthStore();

    // if isAutnenticated is null then wait for it to be set to true or false
    if (authStore.isAuthenticated === null) {
        // Wait for authentication check to complete
        await new Promise(resolve => {
            const interval = setInterval(() => {
                if (authStore.isAuthenticated !== null) {
                    clearInterval(interval);
                    resolve(true);
                }
            }, 100); // Check every 100ms
        });
    }

    // If authentication hasn't been checked yet, do it now
    if (authStore.isAuthenticated && !to.meta.requiresAuth) {
        next({ name: 'InternalHomePage' });
    } else if (!authStore.isAuthenticated && to.meta.requiresAuth) {
        next({ name: 'LoginPage' });
    } else {
        next();
    }
});

export default router;