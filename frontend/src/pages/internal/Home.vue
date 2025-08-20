<template>
  <div>
    <h1>Internal Home Page</h1>
    <p v-if="user?.display_name">Welcome {{ user.display_name }}</p>
    <a href="#" @click.prevent="logout">Logout</a> |
    <a href="#" @click.prevent="changePassword">Change Password</a> |
    <a href="#" @click.prevent="editEmail">Edit Email</a> |
    <a href="#" @click.prevent="editUser">Edit User</a>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAllAuthStore } from '@/stores/allauth';
import { computed } from 'vue';

const router = useRouter()
const allAuthStore = useAllAuthStore();

const user = computed(() => allAuthStore.user_self);

function logout() {
  router.push({ name: 'LogoutPage' })
}

function changePassword() {
  router.push({ name: 'ChangePasswordPage' })
}

function editEmail() {
  router.push({ name: 'EditEmailPage' })
}

function editUser() {
  router.push({ name: 'EditUserInfoPage' })
}
</script>

<style scoped>
</style>
