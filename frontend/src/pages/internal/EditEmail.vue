<template>
  <div class="edit-email">
    <h2>Edit Email Addresses</h2>

    <!-- Display any errors -->
    <div v-if="authErrors.length" class="error-messages">
      <p v-for="(error, index) in authErrors" :key="index" class="error">{{ error }}</p>
    </div>

    <!-- Current Emails -->
    <div v-if="emails.length > 0">
      <h3>Your Emails</h3>
      <ul>
        <li v-for="emailObj in emails" :key="emailObj.email">
        <span>{{ emailObj.email }}</span>
        <button 
            @click="handleMarkAsPrimary(emailObj)" 
            :disabled="!emailObj.verified || emailObj.primary"
            title="You can only mark a verified, non-primary email as primary"
        >
            Mark as Primary
        </button>
        <button @click="handleDeleteEmail(emailObj)">Delete</button>
        </li>

      </ul>
    </div>

    <!-- Add New Email Form -->
    <div class="add-email">
      <input v-model="newEmail" type="email" placeholder="Enter new email" />
      <button @click="handleAddEmail">Add Email</button>
    </div>

    <!-- Email Verification -->
    <div v-if="verificationRequested" class="verification-info">
      <p>A verification email has been sent to your new address.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useAllAuthStore } from '@/stores/allauth';

export default defineComponent({
  name: 'EditEmail',
  setup() {
    const store = useAllAuthStore();
    const newEmail = ref('');
    const verificationRequested = ref(false);

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
      try {
        await store.markEmailAsPrimary(email);
      } catch (error) {
        // Handle any error
        console.error(error);
      }
    };

    // Handle deleting an email
    const handleDeleteEmail = async (email: string) => {
      if (confirm(`Are you sure you want to delete ${email}?`)) {
        try {
          await store.deleteEmail(email);
        } catch (error) {
          // Handle any error
          console.error(error);
        }
      }
    };

    return {
      emails,
      newEmail,
      verificationRequested,
      authErrors,
      handleAddEmail,
      handleMarkAsPrimary,
      handleDeleteEmail,
    };
  },
});
</script>
