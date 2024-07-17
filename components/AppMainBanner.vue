<template>
  <div class="app-main-banner" :class="{ 'without-margin': !show }">
    <UAlert
      v-if="show"
      icon="i-material-symbols-rocket-launch"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: false }"
      title="Próximo lanzamiento (17/07/2024)"
      description="Hilos, respuestas y comentarios"
      color="white"
      variant="soft"
      @close="show = false"
    >
      <template #icon="{ icon }">
        <IconMaterialSymbolsRocketLaunch />
      </template>
    </UAlert>
  </div>
</template>

<script lang="ts" setup>
const show = ref(true)

</script>

<style lang="scss" scoped>
.app-main-banner {
  background: #312e81;
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