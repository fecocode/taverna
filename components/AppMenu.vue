<template>
  <div class="app-menu">
    <div class="app-menu__main">
      <NuxtLink :to="{ name: 'index' }">
        <UAvatar src="/logo.svg" alt="Logo de Solopreneurs" class="logo" />
      </NuxtLink>
      <UTooltip :popper="{ placement: 'right'}" text="Home">
        <NuxtLink :to="{ name: 'index' }">
          <UButton
            icon="i-heroicons-home"
            size="xl"
            :ui="{ rounded: 'rounded-full' }"
            :color="isHighlighted('index') ? 'yellow' : 'gray'"
            variant="ghost"
          />
        </NuxtLink>
      </UTooltip>
      <!-- <UTooltip :popper="{ placement: 'right'}" text="Notifications">
        <NuxtLink :to="{ name: 'index' }">
          <UButton
            icon="i-heroicons-bell"
            size="xl"
            :ui="{ rounded: 'rounded-full' }"
            :color="isHighlighted('lalal') ? 'yellow' : 'gray'"
            variant="ghost"
          />
        </NuxtLink>
      </UTooltip> -->
      <UTooltip :popper="{ placement: 'right' }" text="Liked posts">
        <NuxtLink :to="{ name: 'liked-posts' }">
          <UButton
            icon="i-heroicons-heart"
            size="xl"
            :ui="{ rounded: 'rounded-full' }"
            :color="isHighlighted('liked-posts') ? 'yellow' : 'gray'"
            variant="ghost"
          />
        </NuxtLink>
      </UTooltip>
      <UTooltip :popper="{ placement: 'right' }" text="Profile">
        <NuxtLink :to="profilePageRouterObject">
          <UButton
            icon="i-heroicons-user"
            size="xl"
            :ui="{ rounded: 'rounded-full' }"
            :color="isCurrentRouteUserProfile ? 'yellow' : 'gray'"
            variant="ghost"
          />
        </NuxtLink>
      </UTooltip>
      <UDivider />
      <!-- <UTooltip :popper="{ placement: 'right'}" text="Community products">
        <NuxtLink :to="{ name: 'index' }">
          <UButton
            icon="i-heroicons-squares-plus"
            size="xl"
            :ui="{ rounded: 'rounded-full' }"
            :color="isHighlighted('lelal') ? 'yellow' : 'gray'"
            variant="ghost"
          />
        </NuxtLink>
      </UTooltip>
      <UDivider class="mb-2"/> -->
      <SignedIn>
        <UTooltip :popper="{ placement: 'right' }" text="New post">
          <UButton
            icon="i-heroicons-pencil-square"
            size="xl"
            :ui="{ rounded: 'rounded-full' }"
            color="black"
            @click="modalsStore.openNewPostModal()"
          />
        </UTooltip>
      </SignedIn>
      <SignedOut>
        <UTooltip :popper="{ placement: 'right' }" text="Sign In">
          <UButton
            icon="i-heroicons-key"
            size="xl"
            :ui="{ rounded: 'rounded-full' }"
            color="black"
            @click="modalsStore.openSignInModal()"
          />
        </UTooltip>
      </SignedOut>
    </div>
    <div class="app-menu__bottom">
      <UPopover :popper="{ placement: 'right-end' }">
        <UButton
          icon="i-heroicons-ellipsis-vertical"
          size="xl"
          :ui="{ rounded: 'rounded-full' }"
          color="gray"
          variant="ghost"
        />
        <template #panel="{ close }">
          <div class="ellipsis-menu">
            <UButton
              icon="i-heroicons-book-open"
              size="sm"
              color="gray"
              variant="link"
              label="Terms and conditions"
              @click="handleShowTermsAndConditionsEllipsisMenuClick(close)"
            />
            <UButton
              icon="i-heroicons-book-open"
              size="sm"
              color="gray"
              variant="link"
              label="Privacy policy"
              @click="handleShowPrivacyPolicyEllipsisMenuClick(close)"
            />
            <UButton
              icon="i-heroicons-book-open"
              size="sm"
              color="gray"
              variant="link"
              label="Code of conduct"
              @click="handleShowRulesEllipsisMenuClick(close)"
            />
          </div>
        </template>
      </UPopover>
      <UButton
        icon="i-heroicons-question-mark-circle"
        size="xl"
        :ui="{ rounded: 'rounded-full' }"
        color="gray"
        variant="ghost"
        @click="modalsStore.openHelpModal()"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useModalsStore } from '~/stores/modals';
import { SignedIn, SignedOut, useSession } from 'vue-clerk'

const modalsStore = useModalsStore()
const route = useRoute()
const { session } = useSession()

const profilePageRouterObject = computed(() => {
  const currentUsername = session.value?.user?.username

  if (currentUsername) {
    return {
      name: 'a-username',
      params: {
        username: currentUsername,
      }
    }
  } else {
    return {
      name: 'index'
    }
  }
})

const isCurrentRouteUserProfile = computed(() => {
  const currentUsername = session.value?.user?.username

  if (!currentUsername) return false 

  return route.name === 'a-username' && route.params.username === currentUsername
})

function handleShowTermsAndConditionsEllipsisMenuClick(closePopoverFunction: Function) {
  closePopoverFunction()
  modalsStore.openTermsAndConditionsModal()
}

function handleShowPrivacyPolicyEllipsisMenuClick(closePopoverFunction: Function) {
  closePopoverFunction()
  modalsStore.openPrivacyPolicyModal()
}
function handleShowRepentanceEllipsisMenuClick(closePopoverFunction: Function) {
  closePopoverFunction()
  modalsStore.openRepentanceModal()
}

function handleShowRulesEllipsisMenuClick(closePopoverFunction: Function) {
  closePopoverFunction()
  modalsStore.openRulesModal()
}


function isHighlighted(routeName: string) {
  const currentRouteName = route.name

  return routeName === currentRouteName
}

</script>

<style lang="scss" scoped>
.app-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #1f1f23;
  height: 100%;
  padding: 1rem;
  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
  }
  &__main, &__bottom {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: flex-start;
    align-items: center;
    .logo {
      margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
      gap: 0.5rem;
      .logo {
        margin-bottom: 0.5rem;
      }
    }
  }

  &__bottom {
    .ellipsis-menu {
      display: flex;
      padding: 0.5rem;
      gap: 0.5rem;
      flex-direction: column;
      align-items: flex-start;
      width: fit-content;
    }
  }
}
</style>