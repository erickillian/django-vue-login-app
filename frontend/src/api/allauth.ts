import api from './api';

export interface AuthenticationData {
    email: string;
    password: string;
}

export interface WebAuthnCredential {
    id: string;
    rawId: string;
    type: string;
    response: any;
    clientExtensionResults: any;
}

export const getAuthenticationStatus = async () => {
    return api.get('/_allauth/browser/v1/auth/session');
};

export const login = async (data: AuthenticationData) => {
    return api.post('/_allauth/browser/v1/auth/login', data);
};

export const logout = async () => {
    return api.delete('/_allauth/browser/v1/auth/session');
};

export const signUp = async (data: AuthenticationData) => {
    return api.post('/_allauth/browser/v1/auth/signup', data);
};

export const signUpByPasskey = async (data: { name: string; credential: WebAuthnCredential }) => {
    return api.post('/_allauth/browser/v1/auth/webauthn/signup', data);
};

export const providerSignup = async (data: { provider: string; token: string }) => {
    return api.post('/_allauth/browser/v1/auth/provider/signup', data);
};

export const getProviderAccounts = async () => {
    return api.get('/_allauth/browser/v1/account/providers');
};

export const disconnectProviderAccount = async (provider: string, account: string) => {
    return api.delete('/_allauth/browser/v1/account/providers', { data: { provider, account } });
};

export const getPasswordResetInformation = async (key: string) => {
    return api.get('/_allauth/browser/v1/auth/password/reset', { headers: { 'X-Password-Reset-Key': key } });
};

export const resetPasswordFromKey = async (data: { password: string; key: string }) => {
    return api.post('/_allauth/browser/v1/auth/password/reset', data);
};

export const requestLoginCode = async (email: string) => {
    return api.post('/_allauth/browser/v1/auth/code/request', { email });
};

export const confirmLoginCode = async (code: string) => {
    return api.post('/_allauth/browser/v1/auth/code/confirm', { code });
};

export const getEmailVerification = async (key: string) => {
    return api.get('/_allauth/browser/v1/auth/email/verify', { headers: { 'X-Email-Verification-Key': key } });
};

export const getEmailAddresses = async () => {
    return api.get('/_allauth/browser/v1/account/email');
};

export const getSessions = async () => {
    return api.get('/_allauth/browser/v1/auth/sessions');
};

export const endSessions = async (sessions: string[]) => {
    return api.delete('/_allauth/browser/v1/auth/sessions', { data: { sessions } });
};

export const getAuthenticators = async () => {
    return api.get('/_allauth/browser/v1/account/authenticators');
};

export const getTOTPAuthenticator = async () => {
    return api.get('/_allauth/browser/v1/account/authenticators/totp');
};

export const mfaAuthenticate = async (code: string) => {
    return api.post('/_allauth/browser/v1/auth/2fa/authenticate', { code });
};

export const mfaReauthenticate = async (code: string) => {
    return api.post('/_allauth/browser/v1/auth/2fa/reauthenticate', { code });
};

export const mfaTrust = async (trust: string) => {
    return api.post('/_allauth/browser/v1/auth/2fa/trust', { trust });
};

export const activateTOTPAuthenticator = async (code: string) => {
    return api.post('/_allauth/browser/v1/account/authenticators/totp', { code });
};

export const deactivateTOTPAuthenticator = async () => {
    return api.delete('/_allauth/browser/v1/account/authenticators/totp');
};

export const getRecoveryCodes = async () => {
    return api.get('/_allauth/browser/v1/account/authenticators/recovery-codes');
};

export const generateRecoveryCodes = async () => {
    return api.post('/_allauth/browser/v1/account/authenticators/recovery-codes');
};

export const getConfig = async () => {
    return api.get('/_allauth/browser/v1/config');
};

export const addEmail = async (email: string) => {
    return api.post('/_allauth/browser/v1/account/email', { email });
};

export const deleteEmail = async (email: string) => {
    return api.delete('/_allauth/browser/v1/account/email', { data: { email } });
};

export const markEmailAsPrimary = async (email: string) => {
    return api.patch('/_allauth/browser/v1/account/email', { email, primary: true });
};

export const requestEmailVerification = async (email: string) => {
    return api.post('/_allauth/browser/v1/auth/email/verify/resend', { email });
};

export const verifyEmail = async (key: string) => {
    return api.post('/_allauth/browser/v1/auth/email/verify', { key });
};

export const requestPasswordReset = async (email: string) => {
    return api.post('/_allauth/browser/v1/auth/password/request', { email });
};

export const resetPassword = async (password: string, key: string) => {
    return api.post('/_allauth/browser/v1/auth/password/reset', { "password": password, "key": key });
};

export const changePassword = async (data: { current_password: string; new_password: string }) => {
    return api.post('/_allauth/browser/v1/account/password/change', data);
};

export const getAuth = async () => {
    return api.get('/_allauth/browser/v1/auth/session');
};

export const authenticateByToken = async (
    provider: string,
    token: string,
    process: string = 'login'
) => {
    return api.post('/_allauth/browser/v1/auth/provider/token', { provider, token, process });
};

export const getWebAuthnCreateOptions = async (passwordless?: boolean) => {
    let url = '/_allauth/browser/v1/account/authenticators/webauthn';
    if (passwordless) url += '?passwordless';
    return api.get(url);
};

export const getWebAuthnCreateOptionsAtSignup = async () => {
    return api.get('/_allauth/browser/v1/auth/webauthn/signup');
};

export const addWebAuthnCredential = async (name: string, credential: WebAuthnCredential) => {
    return api.post('/_allauth/browser/v1/account/authenticators/webauthn', { name, credential });
};

export const signupWebAuthnCredential = async (name: string, credential: WebAuthnCredential) => {
    return api.put('/_allauth/browser/v1/auth/webauthn/signup', { name, credential });
};

export const deleteWebAuthnCredential = async (authenticators: string[]) => {
    return api.delete('/_allauth/browser/v1/account/authenticators/webauthn', { data: { authenticators } });
};

export const updateWebAuthnCredential = async (id: string, data: { name?: string }) => {
    return api.put('/_allauth/browser/v1/account/authenticators/webauthn', { id, ...data });
};

export const getWebAuthnRequestOptionsForReauthentication = async () => {
    return api.get('/_allauth/browser/v1/auth/webauthn/reauthenticate');
};

export const reauthenticateUsingWebAuthn = async (credential: WebAuthnCredential) => {
    return api.post('/_allauth/browser/v1/auth/webauthn/reauthenticate', { credential });
};

export const authenticateUsingWebAuthn = async (credential: WebAuthnCredential) => {
    return api.post('/_allauth/browser/v1/auth/webauthn/authenticate', { credential });
};

export const loginUsingWebAuthn = async (credential: WebAuthnCredential) => {
    return api.post('/_allauth/browser/v1/auth/webauthn/login', { credential });
};

export const getWebAuthnRequestOptionsForLogin = async () => {
    return api.get('/_allauth/browser/v1/auth/webauthn/login');
};

export const getWebAuthnRequestOptionsForAuthentication = async () => {
    return api.get('/_allauth/browser/v1/auth/webauthn/authenticate');
};
