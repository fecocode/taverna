<script lang="ts" setup>
import { UserButton, SignedIn, SignedOut } from 'vue-clerk'
import { useModalsStore } from '~/stores/modals';

const modalStore = useModalsStore()
</script>

<template>
  <div class="app-topbar">
    <div class="app-topbar__brand">
      <NuxtLink :to="{ name: 'index' }">
        <span class="name"><b>Chismecito</b>.space</span>
      </NuxtLink>
    </div>
    <div class="app-topbar__actions">
      <SignedIn>
        <div class="user-button">
          <UserButton />
        </div>
      </SignedIn>
      <SignedOut>
        <UButton label="Ingresar" color="gray" variant="ghost" @click="modalStore.openSignInModal()" class="sign-in-button" />
        <UButton label="Crear mi cuenta" color="indigo" @click="modalStore.openSignUpModal()" />
      </SignedOut>
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
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
  &__brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.85rem;
    @media (max-width: 768px) {
      .name {
        display: none;
      }
    }
  }
  &__actions {
    display: flex;
    gap: 2rem;
    align-items: center;
    .menu-button {
      display: none;
    }
    .user-button {
      display: flex;
      align-items: center;
    }

    @media (max-width: 768px) {
      .sign-in-button {
        display: none;
      }
      .menu-button {
        display: flex;
      }
    }
  }
}
</style>