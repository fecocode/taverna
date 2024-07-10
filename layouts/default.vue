<template>
  <div class="default-layout">
    <div class="default-layout__wrapper">
      <AppTopbar />
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
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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