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
    <UNotifications v-if="isLive"/>
  </div>
</template>

<script lang="ts" setup>
import { ClerkLoading, ClerkLoaded, useAuth } from 'vue-clerk'

const runtimeConfig = useRuntimeConfig()

const isLive = computed(() => parseInt(runtimeConfig.public.LIVE))
const auth = useAuth()
const favsStore = useFavsStore()

definePageMeta({
  colorMode: 'dark',
})

const isSignedIn = computed(() => auth.isSignedIn.value)

watch(isSignedIn, async (value) => {
  if (value) {
    await favsStore.fetchUserFavsIds()
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