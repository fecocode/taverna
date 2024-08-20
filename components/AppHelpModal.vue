<template>
  <UCard>
    <template #header>
      <div class="app-help-modal__header">
        <span>Help</span>
        <UButton
          size="xs"
          :ui="{ rounded: 'rounded-full' }"
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-solid"
          @click="$emit('close')"
        >
        </UButton>
      </div>
    </template>
    <div class="app-help-modal">
      <UAlert
        variant="soft"
        icon="i-heroicons-envelope"
        title="Contact me"
      >
        <template #description>
          Need help? You can contact me by email at <a href="mailto:hola@fecocode.com">hola@fecocode.com</a>, and I'll try to get back to you as soon as possible.
        </template>
      </UAlert>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const modalsStore = useModalsStore()

defineEmits(['close'])
</script>

<style lang="scss" scoped>
.app-help-modal {
  font-size: 0.85rem;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>