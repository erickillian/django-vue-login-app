<template>
  <div>
    <h1>Internal Home Page</h1>
    <a href="#" @click.prevent="logout">Logout</a> |
    <a href="#" @click.prevent="changePassword">Change Password</a> |
    <a href="#" @click.prevent="editEmail">Edit Email</a>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  router.push({ name: 'LogoutPage' })
}

function changePassword() {
  router.push({ name: 'ChangePasswordPage' })
}

function editEmail() {
  router.push({ name: 'EditEmailPage' })
}
</script>

<style scoped>
</style>
