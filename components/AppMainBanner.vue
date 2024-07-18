<template>
  <div class="app-main-banner">
    <UAlert
      v-if="show"
      icon="i-heroicons-megaphone"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: false }"
      title="¡Eu, te doy la bienvenida a Chismecito!"
      description="Por favor, comenzá leyendo los detalles de uso de la App"
      :actions="[{ variant: 'solid', color: 'white', label: 'Ver detalles', click: modalsStore.openHelpModal }]"
      color="indigo"
      @close="show = false"
    ></UAlert>
    <UButton
      v-else
      label="Ver mensaje del desarrollador"
      color="indigo"
      variant="ghost"
      icon="i-heroicons-arrow-small-down-solid"
      @click="show = true"
    />
  </div>
</template>

<script lang="ts" setup>
const show = ref(true)
const modalsStore = useModalsStore()
</script>

<style lang="scss" scoped>
.app-main-banner {
  margin: 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    padding: 1rem 2rem;
    width: 100%;
    font-size: 0.8rem;

    a {
      text-decoration: underline;
      color: #fff;
    }
  }

  &.without-margin {
    margin: 0;
  }
}
</style>