<template>
  <div class="default-layout">
    <AppModalsManager />
    <AppWaitingOverlay v-if="!isLive"/>
    <ClerkLoading v-if="isLive">
      <AppLoadingOverlay />
    </ClerkLoading>
    <AppMenu v-if="isLive" class="default-layout__menu"/>
    <div class="default-layout__wrapper" v-if="isLive">
      <AppTopbar />
      <div class="default-layout__wrapper__main">
        <ClerkLoaded>
          <slot />
        </ClerkLoaded>
      </div>
      <AppFooter class="desktop-footer" />
    </div>
    <AppSidebar class="hidden lg:block" />
    <UNotifications v-if="isLive"/>
  </div>
</template>

<script lang="ts" setup>
import { ClerkLoading, ClerkLoaded, useAuth, useClerk, useUser } from 'vue-clerk'

const runtimeConfig = useRuntimeConfig()

const isLive = computed(() => parseInt(runtimeConfig.public.LIVE))
const auth = useAuth()
const favsStore = useFavsStore()
const clerk = useClerk()
const { user } = useUser()
const notificationsStore = useNotificationsStore()

definePageMeta({
  colorMode: 'dark',
})

const isSignedIn = computed(() => auth.isSignedIn.value)

watch(isSignedIn, async (value) => {
  if (value) {
    await favsStore.fetchUserFavsIds()
  }
})

onMounted(async () => {
  const clerk = useClerk()
  
  if (clerk.loaded && isSignedIn.value) {
    await notificationsStore.startNotificationsPolling(user.value)
  }
})

watch([() => clerk.loaded, isSignedIn], async ([loaded, signedIn]) => {
  if (loaded && signedIn) {
    await notificationsStore.startNotificationsPolling(user.value)
  }
})

</script>

<style lang="scss">
.default-layout {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  height: 100vh;
  background-color: #1f1f23;
  &__wrapper {
    width: var(--max-layout-width);
    max-width: 100vw;
    border-left: 1px solid #333;
    border-right: 1px solid #333;
    height: 100%;
    background-color: #1f1f23;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    @media (max-width: 768px) {
      border-radius: 0;
    }

    &__main {
      padding: 0 1rem;
      flex: 1;
      position: relative;
    }

    @media (max-width: 768px) {
      .desktop-footer {
        display: none;
      }
    }
  }
}
</style>