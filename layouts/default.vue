<template>
  <div class="default-layout">
    <AppModalsManager />
    <AppMenu />
    <div class="default-layout__wrapper">
      <AppTopbar />
      <AppMainBanner />
      <div class="default-layout__wrapper__main">
        <slot />
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<script lang="ts" setup>

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