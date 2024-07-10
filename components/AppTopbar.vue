<script lang="ts" setup>
import { UserButton } from 'vue-clerk'
</script>

<template>
  <div class="app-topbar">
    <div class="app-topbar__brand">
      <UAvatar src="/logo.png" alt="Logo de Chismecito" />
      <span><b>Chismecito</b>.space</span>
    </div>
    <div class="app-topbar__actions">
      <UButton
        color="indigo"
        label="Invitar gente"
        icon="i-heroicons-user-plus-20-solid"
        size="xs"
        variant="ghost"
      />
      <UserButton />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-topbar {
  display: flex;
  padding: 1rem 1.5rem;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
  &__brand {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  &__actions {
    display: flex;
    gap: 2rem;
    align-items: center;
  }
}
</style>