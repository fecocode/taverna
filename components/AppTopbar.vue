<script lang="ts" setup>
import { UserButton, SignedIn, SignedOut } from 'vue-clerk'
import { useModalsStore } from '~/stores/modals';

const route = useRoute()
const router = useRouter()

const modalStore = useModalsStore()

const showGoBackComponent = computed(() => {
  return route.name === 'p-id' || route.name === 'a-id' || !!route.query.category
})

const goBackComponentText = computed(() => {
  if (route.name === 'p-id') {
    return 'Post'
  } else if (route.name === 'a-id') {
    return 'Profile'
  }

  if (route.query.category) {
    return route.query.category
  }
})

function handleGoBackClick() {
  router.back()
}
</script>

<template>
  <div class="app-topbar">
    <div class="app-topbar__brand">
      <div v-if="showGoBackComponent" class="flex items-center space-x-4">
        <UButton
          icon="i-heroicons-arrow-left-solid"
          size="sm"
          :ui="{ rounded: 'rounded-full' }"
          color="gray"
          variant="ghost"
          @click="handleGoBackClick"
        />
        <span class="h-fit text-lg font-semibold">{{ goBackComponentText }}</span>
      </div>
      <NuxtLink v-else :to="{ name: 'index' }">
        <span class="name"><b>Taberna</b></span>
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
        <UButton label="Crear mi cuenta" color="black" @click="modalStore.openSignUpModal()" />
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