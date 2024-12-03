<template>
  <UCard>
    <template #header>
      <div class="app-report-modal__header">
        <span>Reportar publicación</span>
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
    <div class="app-report-modal space-y-5">
      <p>
        Estoy trabajando en un sistema automatizado para reportar posts y/o usuarios. Mientras tanto... Enviame un correo electrónico a apps@fecocode.com y lo solucionamos en un corto plazo.<br>
        <br>
        Porfa, enviame el correo así mantenemos la comunidad lo más sana y agradable posible.
      </p>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const modalsStore = useModalsStore()

const reason = ref()
const otherReason = ref('')

defineEmits(['close'])

const reasonsArray = ['Spam',
  'Inappropriate content',
  'Harassment or bullying',
  'False information',
  'Other'
]


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