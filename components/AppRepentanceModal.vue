<template>
  <UCard>
    <template #header>
      <div class="app-repentance-modal__header">
        <span>Arrepentimiento</span>
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
    <div class="app-repentance-modal">
      <p>
        Presionaste el botón de arrepentimiento. Por favor, escribime a <a href="mailto:apps@fecocode.com">apps@fecocode.com</a> y dentro de las 24hs hábiles te daré el paso a paso para revertir tu acción en la App.
      </p>
      <p>
        <u>Importante:</u> La acción que quieras revertir debe estar dentro de lo técnicamente posible.
      </p>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const modalsStore = useModalsStore()

const items = ref([
  {
    id: 0,
    label: 'Código de conducta',
  },
  {
    id: 1,
    label: 'Creación de cuenta',
  },
  {
    id: 2,
    label: 'Eliminación de datos personales',
  },
  {
    id: 3,
    label: 'Reportar un post ofensivo',
  },
  {
    id: 4,
    label: 'Funcionalidades de la app',
  },
  {
    id: 5,
    label: 'Próximos lanzamientos',
  },
])

defineEmits(['close'])
</script>

<style lang="scss" scoped>
.app-repentance-modal {
  font-size: 0.85rem;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>