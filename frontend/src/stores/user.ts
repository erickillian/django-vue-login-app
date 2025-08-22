import { defineStore } from 'pinia';
import router from '@/router'; // Adjust path to your router
import * as allauthApi from '@/api/allauth';
import * as userApi from '@/api/user';

export const useUserStore = defineStore('allauth', {
    state: () => ({
        isAuthenticated: false,
        user: null as null | Record<string, any>,
        user_self: null as null | User,
        user_self_errors: null as null | UserErrors,
        loading: false,
        auth_errors: [] as AuthError[],
        auth_response: null as any,
        emails: [] as any[],
    }),
    persist: {
        storage: sessionStorage,
        serializer: {
            serialize: (state) =>
                JSON.stringify({ isAuthenticated: state.isAuthenticated }),
            deserialize: (str) => {
                const data = JSON.parse(str)
                return { isAuthenticated: data.isAuthenticated }
            },
        },
    },
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
            this.user_self_errors = null;
            try {
                const response = await userApi.updateUser(data);
                this.user_self = response.data;
            } catch (error: any) {
                this.user_self_errors = error.response?.data || null;
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


        async login({ email, password }: { email: string; password: string }) {
            this.loading = true;
            this.email = email;
            this.resetAuthErrors();
            try {
                const response = await allauthApi.login({ email, password });
                this.auth_response = response.data;
                this.user = response.data?.data?.user || null;
                this.isAuthenticated = true;
            } catch (error: any) {
                this.handleAuthErrors(error.response?.data);
                if (error.response?.status === 409) {
                    this.login({ email, password });
                }
            } finally {
                this.loading = false;
            }
        },

        async signup({ email, password }: { email: string; password: string }) {
            this.loading = true;
            this.email = email;
            this.resetAuthErrors();
            try {
                const response = await allauthApi.signUp({ email, password });
                this.auth_response = response.data;
                this.user = response.data?.data?.user || null;
                this.isAuthenticated = true;
            } catch (error: any) {
                this.handleAuthErrors(error.response?.data);
            } finally {
                this.loading = false;
            }
        },

        async verifyEmail(token: string) {
            this.loading = true;
            try {
                const response = await allauthApi.verifyEmail(token);
                this.auth_response = response.data;
            } catch (errors: any) {
                this.handleAuthErrors(errors.response?.data);
                throw errors.response?.data;
            } finally {
                this.loading = false;
            }
        },

        async resetAuthErrors() {
            this.auth_errors = [];
            this.auth_response = null;
        },

        async requestEmailVerification() {
            this.loading = true;
            this.resetAuthErrors();
            try {
                const response = await allauthApi.requestEmailVerification(this.email);
                this.auth_response = response.data;
            } catch (error: any) {
                this.auth_response = error.response?.data || null;
            } finally {
                this.loading = false;
            }
        },

        async getEmails() {
            try {
                const response = await allauthApi.getEmailAddresses();
                this.emails = response.data.data || [];
            } catch (error: any) {
            }
        },

        async addEmail(email: string) {
            this.resetAuthErrors();
            this.loading = true;
            try {
                const response = await allauthApi.addEmail(email);
                this.auth_response = response.data;
                await this.getEmails(); // Refresh email list
            } catch (errors: any) {
                this.handleAuthErrors(errors.response?.data);
            } finally {
                this.loading = false;
            }
        },

        async handleAuthErrors(errors: AuthErrorResponse) {
            if (errors?.status === 400) {
                this.auth_errors = errors.errors ?? [{
                    message: errors.detail || 'An error occurred',
                    code: 'unknown_error',
                    param: 'none'
                }];
            } else if (errors?.status === 401) {
                const is_authenticated: boolean | undefined = errors?.meta?.is_authenticated;
                const is_authenticated_exists = typeof is_authenticated === 'boolean';
                const flows: AuthFlow[] = errors?.data?.flows ?? [];

                if (is_authenticated_exists) {
                    this.isAuthenticated = is_authenticated;
                }

                if (flows.length > 0 && is_authenticated_exists) {
                    // get a list of pending flows
                    const pendingFlows = flows.filter((flow: AuthFlow) => flow.is_pending);

                    // just handle the first pending flow.  Next error will handle the next one.
                    if (pendingFlows.length > 0) {
                        const flow = pendingFlows[0];
                        if (flow.id === 'verify_email') {
                            router.push({ name: 'VerifyEmailPage' });
                            return;
                        } else if (flow.id === 'mfa_login_webauthn') {
                            // Handle MFA WebAuthn flow
                            // router.push('/login/mfa');
                        } else {
                            this.auth_errors = [{
                                message: errors.detail || 'Authentication required',
                                code: 'authentication_required',
                                param: 'none'
                            }];
                        }
                    }

                }
                this.auth_errors = errors.errors ?? [{
                    message: errors.detail || 'Authentication required',
                    code: 'authentication_required',
                    param: 'none'
                }];
            } else if (errors?.status === 409) {
                this.logout();
            } else if (errors?.status === 429) {
                this.auth_errors = errors.errors ?? [{
                    message: errors.detail || 'Too many requests, please try again later',
                    code: 'rate_limit_exceeded',
                    param: 'none'
                }];
            } else {
                this.auth_errors = errors?.errors ?? [{
                    message: errors?.detail || 'An error occurred',
                    code: 'unknown_error',
                    param: 'none'
                }];
            }
        },

        async deleteEmail(email: string) {
            this.loading = true;
            try {
                const response = await allauthApi.deleteEmail(email);
                this.auth_response = response.data;
                await this.getEmails(); // Refresh email list
            } catch (errors: any) {
                this.handleAuthErrors(errors);
            } finally {
                this.loading = false;
            }
        },

        async markEmailAsPrimary(email: string) {
            this.loading = true;
            try {
                const response = await allauthApi.markEmailAsPrimary(email);
                this.auth_response = response.data;
                await this.getEmails(); // Refresh email list
            } catch (error: any) {
                this.auth_response = error.response?.data || null;
            } finally {
                this.loading = false;
            }
        },

        async changePassword({ current_password, new_password }: { current_password: string; new_password: string }) {
            this.resetAuthErrors();
            this.loading = true;
            try {
                const response = await allauthApi.changePassword({
                    current_password: current_password,
                    new_password: new_password,
                });
                this.auth_response = response.data;
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
                this.user = response.data?.data?.user || null;
                this.isAuthenticated = true;
            } catch (error: any) {
                this.handleAuthErrors(error.response?.data);
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            this.loading = true;
            try {
                await allauthApi.logout();
            } catch (error: any) {
            } finally {
                // Reset store to its default state
                this.loading = false;
                this.isAuthenticated = false;
                this.user = null;
                this.loading = false;
                this.auth_errors = [];
                this.auth_response = null;
            }
        }
    },
});
