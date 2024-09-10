<template>
  <UCard>
    <template #header>
      <div class="flex justify-between">
        <h3 class="font-semibold text-xl">Filter by category</h3>
        <UButton
          size="sm"
          :ui="{ rounded: 'rounded-full' }"
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-solid"
          @click="$emit('close')"
        />
      </div>
    </template>
    <div class="space-y-6">
      <UInput
        placeholder="Search category"
        variant="none"
        icon="i-heroicons-magnifying-glass-16-solid"
        v-model="textSearch"
        :ui="{ icon: { trailing: { pointer: '' } } }"
      >
        <template #trailing>
          <UButton
            v-show="textSearch !== ''"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="textSearch = ''"
          />
        </template>
      </UInput>
      <div class="flex flex-wrap items-center justify-start gap-x-1 gap-y-2">
        <NuxtLink :to="{ name: 'index', query: {category: toKebabCase(category)} }" v-for="category in categories">
          <UButton
            icon="i-heroicons-hashtag-16-solid"
            :label="category"
            color="gray"
            size="md"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
          />
        </NuxtLink>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import supportedPostCategories from '~/constants/supported-post-categories.constants';

const textSearch = ref('')

defineEmits(['close'])

const categories = computed(() => {
  return supportedPostCategories.sort((a, b) => a.localeCompare(b)).filter((c) => c.toLocaleLowerCase().includes(textSearch.value.toLocaleLowerCase()))
})
</script>