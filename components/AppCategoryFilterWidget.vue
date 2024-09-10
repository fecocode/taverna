<template>
  <div class="space-y-3 px-3 py-5">
    <h3 class="font-medium text-md">Explore posts by category</h3>
    <div class="flex flex-wrap items-center justify-start gap-x-1 gap-y-2">
      <NuxtLink :to="{ name: 'index', query: {category: toKebabCase(category)} }" v-for="category in categories">
        <UButton
          icon="i-heroicons-hashtag-16-solid"
          :label="category"
          color="gray"
          size="2xs"
          variant="soft"
          :ui="{ rounded: 'rounded-full' }"
        />
      </NuxtLink>
    </div>
    <div class="flex justify-start py-2">
      <UButton
        color="black"
        size="xs"
        label="Show all categories"
        variant="link"
        icon="i-heroicons-magnifying-glass-16-solid"
        @click="showSearchModal = true"
      />
    </div>
  </div>
  <UModal v-model="showSearchModal" :ui="{ container: 'flex min-h-full items-start lg:items-start justify-center text-center', width: 'w-full sm:max-w-screen-lg' }">
    <AppCategoryFilterModal @close="showSearchModal = false"/>
  </UModal>
</template>

<script lang="ts" setup>
import supportedPostCategories from '~/constants/supported-post-categories.constants';
import { toKebabCase } from '~/utils/strings.utilities';

const showSearchModal = ref(false)
const categories = ref<string[]>([])

onMounted(() => {
  categories.value = shuffleArray(supportedPostCategories).slice(0, 7)
})

function shuffleArray(array: Array<string>) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
</script>