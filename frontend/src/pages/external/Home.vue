<template>
    <div>
        <h1>External Home Page</h1>
        <nav>
            <a href="#" @click.prevent="goToLogin">Login</a>
            <span> | </span>
            <a href="#" @click.prevent="goToSignup">Sign Up</a>
        </nav>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLogin() {
    router.push('/login')
}

function goToSignup() {
    router.push('/signup')
}
</script>

<style scoped>
</style>