<script lang="ts" setup>
</script>

<template>
  <AppScrollbarWrapper class="scroll-bar">
    <div class="posts-wrapper">
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
    </div>
  </AppScrollbarWrapper>
</template>

<style lang="scss" scoped>
.scroll-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.posts-wrapper {
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
}
</style>