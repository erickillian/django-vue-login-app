import { defineStore } from 'pinia';
import router from '@/router'; // Adjust path to your router
import * as allauthApi from '@/api/allauth';
import * as userApi from '@/api/user';

export const useAllAuthStore = defineStore('allauth', {
    state: () => ({
        isAuthenticated: null,
        user: null as null | Record<string, any>,
        user_self: null as any,
        loading: false,
        auth_errors: [] as string[],
        auth_response: null as any,
    }),

    actions: {
        async getUserInfo() {
            try {
                const response = await userApi.getUser();
                this.user_self = response.data || null;
            } catch (error: any) {
                this.user = null;
            }
        },

        async updateUser(data: Record<string, any>) {
            this.loading = true;
            try {
                const response = await userApi.updateUser(data);
                this.user = response.data?.data?.user || this.user;
                return response;
            } catch (error: any) {
                this.auth_errors = error.response?.data?.errors?.map(
                    (e: any) => e.message || 'User update failed'
                ) || [error.response?.data?.detail || 'User update failed'];
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async checkAuthentication() {
            try {
                this.getUserInfo();
                const response = await allauthApi.getAuthenticationStatus();
                const meta = response.data?.meta;
                this.isAuthenticated = meta?.is_authenticated === true;
                this.user = response.data?.data?.user || null;
            } catch (error: any) {
                this.isAuthenticated = false;
                this.user = null;
            }
        },
        async handeNextAuthFlowStep() {
            // Handle 400: Validation errors
            if (this.auth_response?.status === 200) {
                this.auth_errors = null;
                this.checkAuthentication();
            }
            else if (this.auth_response?.status === 400) {
                this.auth_errors = this.auth_response?.errors?.map(
                    (e: any) => e.message || 'Login failed'
                ) || [this.auth_response?.detail || 'Login failed'];
            }
            // Handle 401: Authentication or re-authentication required
            else if (this.auth_response?.status === 401) {
                const meta = this.auth_response?.meta;
                const flows = this.auth_response?.data?.flows;
                this.flows = flows || null;
                // Not authenticated
                if (meta?.is_authenticated === false) {
                    // Determine next step from flows array and their properties
                    if (Array.isArray(flows)) {
                        const verifyEmailFlow = flows.find((f: any) => f.id === 'verify_email' && f.is_pending);
                        const mfaWebauthnFlow = flows.find((f: any) => f.id === 'mfa_login_webauthn');
                        if (verifyEmailFlow) {
                            router.push('/verify-email');
                        } else if (mfaWebauthnFlow) {
                            router.push('/login/mfa');
                        } else {
                            // Default: show login error
                            this.auth_errors = [
                                this.auth_response?.data?.detail || 'Authentication required',
                            ];
                        }
                    } else {
                        // Default: show login error
                        this.auth_errors = [
                            this.auth_response?.data?.detail || 'Authentication required',
                        ];
                    }
                    this.flowStage = 'verify_email';
                    router.push('/verify-email');
                } else {
                    // Default: show login error
                    this.auth_errors = [
                        this.auth_response?.data?.detail || 'Authentication required',
                    ];
                }
            } else if (this.auth_response?.status === 409) {

            }
        },

        async login({ email, password }: { email: string; password: string }) {
            this.loading = true;
            this.email = email;
            this.authError = null;
            this.auth_errors = [];
            try {
                const response = await allauthApi.login({ email, password });
                this.auth_response = response.data;
            } catch (error: any) {
                this.auth_response = error.response?.data || null;
            } finally {
                this.loading = false;
            }
        },

        async signup({ email, password }: { email: string; password: string }) {
            this.loading = true;
            this.email = email;
            this.authError = null;
            this.auth_errors = [];
            try {
                const response = await allauthApi.signUp({ email, password });
                this.auth_response = response.data;
            } catch (error: any) {
                this.auth_response = error.response?.data || null;
            } finally {
                this.loading = false;
            }
        },

        async verifyEmail(token: string) {
            this.loading = true;
            try {
                const response = await allauthApi.verifyEmail(token);
                this.auth_response = response.data;
            } catch (error: any) {
                this.auth_response = error.response?.data || null;
            } finally {
                this.loading = false;
            }
        },

        async requestEmailVerification() {
            this.loading = true;
            try {
                const response = await allauthApi.requestEmailVerification(this.email);
                this.auth_response = response.data;
            } catch (error: any) {
                this.auth_response = error.response?.data || null;
            } finally {
                this.loading = false;
            }
        },

        async changePassword({ current_password, new_password }: { current_password: string; new_password: string }) {
            this.loading = true;
            try {
                const response = await allauthApi.changePassword({
                    current_password: current_password,
                    new_password: new_password,
                });
            } catch (error: any) {
                this.auth_response = error.response?.data || null;
                this.auth_errors = error.response?.data?.errors?.map(
                    (e: any) => e.message || 'Password change failed'
                ) || [error.response?.data?.detail || 'Password change failed'];
            } finally {
                this.loading = false;
            }
        },

        async requestPasswordReset(email: string) {
            this.loading = true;
            this.auth_errors = [];
            this.password_reset_request_success = false;
            try {
                const response = await allauthApi.requestPasswordReset(email);
                this.auth_response = response.data;
                this.password_reset_request_success = true;
                this.auth_response = response.data;
            } catch (error: any) {
                this.auth_response = error.response?.data || null;
                this.auth_errors = error.response?.data?.errors?.map(
                    (e: any) => e.message || 'Password reset failed'
                ) || [error.response?.data?.detail || 'Password reset failed'];
            } finally {
                this.loading = false;
            }
        },

        async resetPassword(key: string, password: string) {
            this.loading = true;
            try {
                const response = await allauthApi.resetPassword(password, key);
                this.auth_response = response.data;
            } catch (error: any) {
                this.auth_response = error.response?.data || null;
                this.auth_errors = error.response?.data?.errors?.map(
                    (e: any) => e.message || 'Password reset failed'
                ) || [error.response?.data?.detail || 'Password reset failed'];
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            this.loading = true;
            try {
                await allauthApi.logout();
            } catch (error: any) {
                console.log(error);
                // Reset store to its default state
                this.isAuthenticated = false;
                this.user = null;
                this.loading = false;
                this.auth_errors = [];
                this.auth_response = null;
            } finally {
                this.loading = false;
            }
        }
    },
});
