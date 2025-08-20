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
            <div v-if="allauth.error" style="color: red; margin-top: 8px;">
                {{ allauth.error }}
            </div>
            <div v-if="localError" style="color: red; margin-top: 8px;">
                {{ localError }}
            </div>
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
import { useAllAuthStore } from '@/stores/allauth'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const localError = ref('')
const allauth = useAllAuthStore()

function clearError() {
    localError.value = ''
    allauth.error = ''
}

async function handleSignup() {
    clearError()
    if (password.value !== confirmPassword.value) {
        localError.value = "Passwords do not match"
        return
    }
    await allauth.signup({ email: email.value, password: password.value })
    allauth.handeNextAuthFlowStep()
}

function goToLogin() {
    router.push('/login')
}
</script>