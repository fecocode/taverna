<template>
  <div class="app-skeleton-post">
    <div class="app-skeleton-post__profile">
      <USkeleton class="h-8 w-8" :ui="{ rounded: 'rounded-full', background: 'bg-zinc-100 dark:bg-zinc-900' }" />
      <USkeleton class="h-4 w-[200px]" :ui="{ background: 'bg-zinc-100 dark:bg-zinc-900' }" />
    </div>
    <USkeleton class="h-5 w-full" :ui="{ background: 'bg-zinc-100 dark:bg-zinc-900' }" />
    <UButtonGroup size="xs" orientation="horizontal" class="app-skeleton-post__actions">
      <USkeleton class="h-4 w-[50px]" :ui="{ background: 'bg-zinc-100 dark:bg-zinc-900' }" />
      <USkeleton class="h-4 w-[50px]" :ui="{ background: 'bg-zinc-100 dark:bg-zinc-900' }" />
      <USkeleton class="h-4 w-[50px]" :ui="{ background: 'bg-zinc-100 dark:bg-zinc-900' }" />
    </UButtonGroup>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.app-skeleton-post {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid #333;
  padding: 1rem 1.5rem;
  gap: 1rem;

  &:last-of-type {
    border-bottom: none;
  }

  &__profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__actions {
    padding: 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}
</style>