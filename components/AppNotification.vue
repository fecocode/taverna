<template>
  <NuxtLink :to="props.link">
    <div class="flex items-start p-4 hover:bg-zinc-900 transition-colors cursor-pointer border-b border-zinc-700">
      <div class="flex-shrink-0 mr-3">
        <img 
          :src="props.image"
          class="w-10 h-10 rounded-full object-cover"
        />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm text-zinc-300" v-html="props.text"></p>
        <p class="text-xs text-zinc-500 mt-1">
          {{ notificationTimeAgo }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import { getTimeAgo } from '~/utils/format-dates.utilities';

const props = defineProps<{
  image: string
  text: string
  timestamp: Date
  link: string
}>()

const notificationTimeAgo = computed(() => getTimeAgo(props.timestamp))

</script>