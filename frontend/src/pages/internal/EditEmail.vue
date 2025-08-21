<template>
  <div class="edit-email">
    <h2>Edit Email Addresses</h2>

    <!-- Current Emails -->
    <div v-if="emails.length > 0">
      <h3>Your Emails</h3>
      <ul>
        <li v-for="emailObj in emails" :key="emailObj.email">
        <span>{{ emailObj.email }}</span>
        <span v-if="emailObj.verified"> ✅ </span>
        <span v-else> ❌ </span>
        <button 
            @click="handleMarkAsPrimary(emailObj.email)" 
            v-if="emailObj.verified && !emailObj.primary"
            title="You can only mark a verified, non-primary email as primary"
        >
            Mark as Primary
        </button>
        <button @click="handleDeleteEmail(emailObj.email)">Delete</button>
        <button v-if="!emailObj.verified" @click="handleVerifyEmail(emailObj.email)">Verify</button>
        </li>
      </ul>
    </div>

    <!-- Add New Email Form -->
    <form @submit.prevent="handleAddEmail">
      <input v-model="newEmail" type="email" placeholder="Enter new email" />
      <button @click="handleAddEmail">Add Email</button>
    </form>
    <AuthErrors />
    <router-link to="/">Back to Profile</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useAllAuthStore } from '@/stores/allauth';
import { useRouter } from 'vue-router';
import AuthErrors from '@/components/AuthErrors.vue';


export default defineComponent({
  name: 'EditEmail',
  components: {
    AuthErrors,
  },
  setup() {
    const store = useAllAuthStore();
    const newEmail = ref('');
    const verificationRequested = ref(false);
    const router = useRouter();

    // Get the list of emails from the store
    const emails = computed(() => store.emails);
    const authErrors = computed(() => store.auth_errors ?? []);

    // Fetch the current emails when the component is mounted
    store.getEmails();

    // Handle adding a new email
    const handleAddEmail = async () => {
      if (newEmail.value) {
        try {
          await store.addEmail(newEmail.value);
          verificationRequested.value = true;  // Indicate that a verification was requested
          newEmail.value = '';  // Clear the input field
        } catch (error) {
          // Handle the error if the add email failed
          console.error(error);
        }
      } else {
        console.warn('Please enter a valid email address.');
      }
    };

    // Handle marking an email as primary
    const handleMarkAsPrimary = async (email: string) => {
        store.markEmailAsPrimary(email);
    };

    // Handle deleting an email
    const handleDeleteEmail = async (email: string) => {
        store.deleteEmail(email);
    };

    const handleVerifyEmail = async (email: string) => {
        router.push({ name: 'VerifyEmailPage'});
    };

    return {
      emails,
      newEmail,
      verificationRequested,
      authErrors,
      handleAddEmail,
      handleMarkAsPrimary,
      handleDeleteEmail,
      handleVerifyEmail,
    };
  },
});
</script>
