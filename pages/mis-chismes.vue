<template>
  <AppScrollbarWrapper class="scroll-bar">
    <div class="users-posts">
      <h3><span class="text-indigo-500">#</span> Tus chismes</h3>
      <AppUsersPost />
      <AppUsersPost />
      <AppUsersPost />
      <AppUsersPost />
      <AppUsersPost />
      <AppUsersPost />
      <AppUsersPost />
      <AppUsersPost />
      <AppUsersPost />
    </div>
  </AppScrollbarWrapper>
</template>

<script lang="ts" setup>

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
}
</style>