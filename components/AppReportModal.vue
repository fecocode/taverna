<template>
  <UCard>
    <template #header>
      <div class="app-report-modal__header">
        <span>Reportar</span>
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
    <div class="app-report-modal">
      <p>
        Actualmente estoy trabajando en un sistema de reporte de posts automatizado e integrado a la app para que sea más eficiente.
      </p>
      <br>
      <p>
        Por el momento, por favor escribime a <a href="mailto:apps@fecocode.com">apps@fecocode.com</a> con el link del post que te resultó ofensivo, de mal gusto o que violaba el código de conducta y te daré respuesta en la mayor brevedad posible.
      </p>
      <br>
      <p>
        <u>Importante:</u> Para obtener el link del post, podés utilizar el botón <b>Copiar link</b> o <b>Compartir</b>.
      </p>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const modalsStore = useModalsStore()

defineEmits(['close'])
</script>

<style lang="scss" scoped>
.app-report-modal {
  font-size: 0.85rem;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>