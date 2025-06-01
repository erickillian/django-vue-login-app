<template>
    <div>
        <h1>Internal Home Page</h1>
        <a href="#" @click.prevent="logout">Logout</a> |
        <a href="#" @click.prevent="changePassword">Change Password</a>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
    router.push('/logout')
}

function changePassword() {
    router.push('/change-password')
}
</script>

<style scoped>
</style>