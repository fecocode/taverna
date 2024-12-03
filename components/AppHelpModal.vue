<template>
  <UCard>
    <template #header>
      <div class="app-help-modal__header">
        <span>Ayuda</span>
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
        title="Contacto"
      >
        <template #description>
          ¿Necesitás ayuda? Escribime a <a href="mailto:apps@fecocode.com">apps@fecocode.com</a>, y trato de responderte en la mayor brevedad. ¡Gracias!
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