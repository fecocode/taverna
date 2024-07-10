<template>
  <div class="app-modals-manager">
    <UModal v-model="modalsStore.isTermsAndConditionsModalOpen">
      <h3>Terms and conditions</h3>
    </UModal>
    <UModal v-model="modalsStore.isPrivacyPolicyModalOpen">
      <h3>Privacy policy</h3>
    </UModal>
    <UModal v-model="modalsStore.isHelpModalOpen">
      <h3>Help</h3>
    </UModal>
    <UModal v-model="modalsStore.isSignInModalOpen" :ui="{ background: 'bg-transparent dark:bg-transparent', width: '' }">
      <AppSignInModal />
    </UModal>
    <UModal v-model="modalsStore.isSignUpModalOpen" :ui="{ background: 'bg-transparent dark:bg-transparent', width: '' }">
      <AppSignUpModal />
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { useModalsStore } from '~/stores/modals';

const modalsStore = useModalsStore()
</script>

<style>

</style>