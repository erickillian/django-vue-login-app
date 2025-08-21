import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

// public routes
const publicRoutes = [
    { path: '/', name: 'ExternalHomePage', component: () => import('@/pages/external/Home.vue') },
    { path: '/login', name: 'LoginPage', component: () => import('@/pages/external/Login.vue') },
    { path: '/signup', name: 'SignUpPage', component: () => import('@/pages/external/SignUp.vue') },
    { path: '/verify-email', name: 'VerifyEmailPage', component: () => import('@/pages/external/VerifyEmail.vue') },
    { path: '/forgot-password', name: 'ForgotPasswordPage', component: () => import('@/pages/external/ForgotPassword.vue') },
    { path: '/reset-password/:code', name: 'ResetPasswordPage', component: () => import('@/pages/external/ResetPassword.vue'), props: true }
];

// internal routes
const internalRoutes = [
    { path: '/', name: 'InternalHomePage', component: () => import('@/pages/internal/Home.vue') },
    { path: '/logout', name: 'LogoutPage', component: () => import('@/pages/internal/Logout.vue') },
    { path: '/change-password', name: 'ChangePasswordPage', component: () => import('@/pages/internal/ChangePassword.vue') },
    { path: '/settings/edit-email', name: 'EditEmailPage', component: () => import('@/pages/internal/EditEmail.vue') },
    { path: '/settings/verify-email', name: 'VerifyEmailPage', component: () => import('@/pages/internal/VerifyEmail.vue') },
    { path: '/settings/edit', name: 'EditUserInfoPage', component: () => import('@/pages/internal/EditUserInfo.vue') },
];

const catchAllRoute = {
    path: '/:pathMatch(.*)*',
    redirect: '/'
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        catchAllRoute,
    ]
});

// helper to reset routes
function resetRoutes() {
    router.getRoutes().forEach(route => {
        if (route.name && route.name !== 'NotFound') {
            router.removeRoute(route.name);
        }
    });
}

// set up auth-based routes when store changes
export function setupRoutes(authStore) {
    if (authStore.isAuthenticated) {
        resetRoutes();
        internalRoutes.forEach(r => router.addRoute(r));
    } else {
        resetRoutes();
        publicRoutes.forEach(r => router.addRoute(r));
    }
    // always keep a catch-all
    router.addRoute(catchAllRoute);
}

export default router;
