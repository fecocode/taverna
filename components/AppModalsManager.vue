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
    <UModal v-model="modalsStore.isNewPostModalOpen" :ui="{ background: 'bg-transparent dark:bg-transparent', width: 'var(--max-layout-width)' }">
      <AppNewPost />
    </UModal>
    <UModal v-model="modalsStore.isRickRollModalOpen" :ui="{ background: 'bg-transparent dark:bg-transparent', width: 'var(--max-layout-width)' }">
      <AppRickRoll />
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { useModalsStore } from '~/stores/modals';

const modalsStore = useModalsStore()
</script>

<style lang="scss" scoped>
.app-modals-manager {
  z-index: 101;
}
</style>