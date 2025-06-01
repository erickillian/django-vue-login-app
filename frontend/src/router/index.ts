import { createRouter, createWebHistory } from 'vue-router';
import { useAllAuthStore } from '@/stores/allauth'; // Adjust path as needed

// Public routes
const publicRoutes = [
    {
        path: '/',
        name: 'ExternalHomePage',
        component: () => import('@/pages/external/Home.vue'),
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: () => import('@/pages/external/Login.vue'),
    },
    {
        path: '/signup',
        name: 'SignUpPage',
        component: () => import('@/pages/external/SignUp.vue'),
    },
    {
        path: '/verify-email',
        name: 'VerifyEmailPage',
        component: () => import('@/pages/external/VerifyEmail.vue'),
    },
    {
        path: '/forgot-password',
        name: 'ForgotPasswordPage',
        component: () => import('@/pages/external/ForgotPassword.vue'),
    },
    {
        path: '/reset-password/:code',
        name: 'ResetPasswordPage',
        component: () => import('@/pages/external/ResetPassword.vue'),
        props: (route) => ({ code: route.params.code }),
    },
];

// Internal routes (requires authentication)
const internalRoutes = [
    {
        path: '/',
        name: 'InternalHomePage',
        component: () => import('@/pages/internal/Home.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/logout',
        name: 'LogoutPage',
        component: () => import('@/pages/internal/Logout.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/change-password',
        name: 'ChangePasswordPage',
        component: () => import('@/pages/internal/ChangePassword.vue'),
        meta: { requiresAuth: true },
    },
];

// Merge routes and add a catch-all redirect
const routes = [
    ...publicRoutes,
    ...internalRoutes,
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// Global navigation guard
router.beforeEach(async (to, from, next) => {
    const authStore = useAllAuthStore();

    const isLoggedIn = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isLoggedIn) {
        // Redirect unauthenticated users to login
        next({ name: 'LoginPage' });
    } else if (
        !to.meta.requiresAuth &&
        isLoggedIn &&
        ['ExternalHomePage', 'LoginPage', 'SignUpPage', 'VerifyEmailPage'].includes(to.name as string)
    ) {
        // Redirect logged-in users away from public pages
        next({ name: 'InternalHomePage' });
    } else {
        next();
    }
});

export default router;
