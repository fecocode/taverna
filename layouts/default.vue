<template>
  <div class="default-layout">
    <AppModalsManager />
    <AppWaitingOverlay v-if="!isLive"/>
    <ClerkLoading v-if="isLive">
      <AppLoadingOverlay />
    </ClerkLoading>
    <AppMenu v-if="isLive"/>
    <div class="default-layout__wrapper" v-if="isLive">
      <AppTopbar />
      <AppMainBanner />
        <div class="default-layout__wrapper__main">
          <ClerkLoaded>
            <slot />
          </ClerkLoaded>
        </div>
      <AppFooter />
    </div>
    <UNotifications v-if="isLive"/>
  </div>
</template>

<script lang="ts" setup>
import { ClerkLoading, ClerkLoaded } from 'vue-clerk'

const runtimeConfig = useRuntimeConfig()

const isLive = computed(() => parseInt(runtimeConfig.public.LIVE))

</script>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
  height: 100vh;

  &__wrapper {
    width: var(--max-layout-width);
    max-width: 100vw;
    border: 1px solid #333;
    height: 100%;
    background-color: #1f1f23;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &__main {
      padding: 0 1rem;
      flex: 1;
      position: relative;
    }
  }
}
</style>