<template>
    <div>
        <router-link :to="{ name: 'ExternalHomePage' }">Back</router-link>
        <h1>Sign Up</h1>
        <form @submit.prevent="handleSignup">
            <div>
                <label for="email">Email</label>
                <input
                    v-model="email"
                    type="email"
                    id="email"
                    required
                    :disabled="allauth.loading"
                    @input="clearError"
                />
            </div>
            <div>
                <label for="password">Password</label>
                <input
                    v-model="password"
                    type="password"
                    id="password"
                    required
                    :disabled="allauth.loading"
                    @input="clearError"
                />
            </div>
            <div>
                <label for="confirmPassword">Confirm Password</label>
                <input
                    v-model="confirmPassword"
                    type="password"
                    id="confirmPassword"
                    required
                    :disabled="allauth.loading"
                    @input="clearError"
                />
            </div>
            <button type="submit" :disabled="allauth.loading">
                <span v-if="allauth.loading">Signing up...</span>
                <span v-else>Sign Up</span>
            </button>
            <AuthErrors />
        </form>
        <p>
            Already have an account?
            <a href="#" @click.prevent="goToLogin">Login</a>
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AuthErrors from '@/components/AuthErrors.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const allauth = useUserStore()

async function handleSignup() {
    if (password.value !== confirmPassword.value) {
        allauth.auth_errors = ['Passwords to not match'];
        return;
    }
    allauth.resetAuthErrors();
    await allauth.signup({ email: email.value, password: password.value });
    allauth.handeNextAuthFlowStep();
}

function goToLogin() {
    router.push('/login');
}
</script>