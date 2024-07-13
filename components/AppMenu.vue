<template>
  <div class="app-menu">
    <UTooltip :popper="{ placement: 'right' }" text="Home">
      <NuxtLink :to="{ name: 'index' }">
        <UButton
          icon="i-heroicons-home"
          size="xl"
          :ui="{ rounded: 'rounded-full' }"
          :color="isHighlighted('index') ? 'indigo' : 'gray'"
          variant="ghost"
        />
      </NuxtLink>
    </UTooltip>
    <UTooltip :popper="{ placement: 'right' }" text="Mis pochoclos">
      <NuxtLink :to="{ name: 'pochoclos' }">
        <UButton
          size="xl"
          :ui="{ rounded: 'rounded-full' }"
          :color="isHighlighted('pochoclos') ? 'indigo' : 'gray'"
          variant="ghost"
        >
          <template #leading>
            <IconParkOutlinePopcorn style="font-size: 1.5rem;"/>
          </template>
        </UButton>
      </NuxtLink>
    </UTooltip>
    <UTooltip :popper="{ placement: 'right' }" text="Mis chismes">
      <NuxtLink :to="{ name: 'mis-chismes' }">
        <UButton
          icon="i-heroicons-user"
          size="xl"
          :ui="{ rounded: 'rounded-full' }"
          :color="isHighlighted('mis-chismes') ? 'indigo' : 'gray'"
          variant="ghost"
        />
      </NuxtLink>
    </UTooltip>
    <SignedIn>
      <UTooltip :popper="{ placement: 'right' }" text="Nuevo chisme">
        <UButton
          icon="i-heroicons-pencil-square"
          size="xl"
          :ui="{ rounded: 'rounded-full' }"
          color="indigo"
          @click="modalsStore.openNewPostModal()"
        />
      </UTooltip>
    </SignedIn>
    <SignedOut>
      <UTooltip :popper="{ placement: 'right' }" text="Ingresar">
        <UButton
          icon="i-heroicons-key"
          size="xl"
          :ui="{ rounded: 'rounded-full' }"
          color="indigo"
          @click="modalsStore.openSignInModal()"
        />
      </UTooltip>
    </SignedOut>
  </div>
</template>

<script lang="ts" setup>
import { useModalsStore } from '~/stores/modals';
import { SignedIn, SignedOut} from 'vue-clerk'

const modalsStore = useModalsStore()
const route = useRoute()

function isHighlighted(routeName: string) {
  const currentRouteName = route.name

  return routeName === currentRouteName
}
</script>

<style lang="scss" scoped>
.app-menu {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: flex-start;
  align-items: center;
  background-color: #0c0b22;
  padding: 1rem;
  padding-right: 2rem;
  height: 100%;
  margin-right: -1rem;
  border-radius: 1rem 0 0 1rem;
  border: 1px solid #151515;
}
</style>