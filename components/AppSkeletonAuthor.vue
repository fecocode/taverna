<template>
  <div class="flex flex-col space-y-7 p-6 bg-zinc-800 border-b border-zinc-700">
    <USkeleton class="h-16 w-16" :ui="{ rounded: 'rounded-full', background: 'bg-zinc-100 dark:bg-zinc-900' }" />
    <USkeleton class="h-4 w-[200px]" :ui="{ background: 'bg-zinc-100 dark:bg-zinc-900' }" />
    <USkeleton class="h-3 w-[100px]" :ui="{ background: 'bg-zinc-100 dark:bg-zinc-900' }" />
  </div>
</template>
