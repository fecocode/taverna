<template>
  <div class="app-modals-manager">
    <UModal v-model="modalsStore.isRulesModalOpen" :ui="{ background: 'bg-transparent dark:bg-transparent', width: 'var(--max-layout-width)' }">
      <AppRulesModal @close="modalsStore.closeRulesModal()"/>
    </UModal>
    <UModal v-model="modalsStore.isTermsAndConditionsModalOpen" :ui="{ background: 'bg-transparent dark:bg-transparent', width: 'var(--max-layout-width)' }">
      <AppTermsAndConditionsModal @close="modalsStore.closeTermsAndConditionsModal()"/>
    </UModal>
    <UModal v-model="modalsStore.isPrivacyPolicyModalOpen" :ui="{ background: 'bg-transparent dark:bg-transparent', width: 'var(--max-layout-width)' }">
      <AppPrivacyPolicyModal @close="modalsStore.closePrivacyPolicyModal()"/>
    </UModal>
    <UModal v-model="modalsStore.isHelpModalOpen" :ui="{ background: 'bg-transparent dark:bg-transparent', width: 'var(--max-layout-width)' }">
      <AppHelpModal @close="modalsStore.closeHelpModal()" />
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
    <UModal v-model="modalsStore.isRickRollModalOpen" :ui="{ background: 'bg-transparent dark:bg-transparent', width: 'var(--max-layout-width)' }">
      <AppRickRoll />
    </UModal>
    <UModal v-model="modalsStore.isDeletePostModalOpen" :ui="{ background: 'bg-transparent dark:bg-transparent', width: 'var(--max-layout-width)' }">
      <AppDeletePostModal />
    </UModal>
    <UModal v-model="modalsStore.isEditPostModalOpen" :ui="{ background: 'bg-transparent dark:bg-transparent', width: 'var(--max-layout-width)' }">
      <AppEditPost />
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