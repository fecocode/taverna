<template>
  <AppScrollbarWrapper class="scroll-bar">
    <div class="users-posts">
      <h3 class="flex space-x-3 items-center">
        <UIcon name="i-heroicons-bookmark" class="text-yellow-400" />
        <span>Saved posts</span>
      </h3>
      <SignedIn>
        <AppUsersPost />
        <AppUsersPost />
        <AppUsersPost />
        <AppUsersPost />
        <AppUsersPost />
        <AppUsersPost />
        <AppUsersPost />
        <AppUsersPost />
        <AppUsersPost />
      </SignedIn>
      <SignedOut>
        <div class="users-posts__signed-out">
          <IconLineMdAlertCircle class="icon" />
          <p>Para crear, borrar y editar tus chismes, necesitás una cuenta de <strong>Solopreneurs</strong></p>
          <UButton color="indigo" size="xl" label="Crear cuenta" @click="modalStore.openSignUpModal()" />
        </div>
      </SignedOut>
    </div>
  </AppScrollbarWrapper>
</template>

<script lang="ts" setup>
import { SignedOut, SignedIn } from 'vue-clerk'

const modalStore = useModalsStore()
</script>

<style lang="scss" scoped>
.scroll-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.users-posts {
  display: flex;
  flex-direction: column;
  padding: 0 1rem;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #777;
    margin: 1.5rem 0;
    padding: 0 1rem;
  }

  &__empty, &__signed-out {
    color: #777;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 3rem 0;
    gap: 1rem;

    p {
      max-width: 350px;
      text-align: center;
    }

    .icon {
      font-size: 5rem;
    }
  }
}
</style>