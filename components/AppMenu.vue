<template>
  <div class="app-menu">
    <div class="app-menu__main">
      <UAvatar src="/logo.png" alt="Logo de Chismecito" class="logo" />
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
      <!-- <UTooltip :popper="{ placement: 'right' }" text="Mis chismes">
        <NuxtLink :to="{ name: 'mis-chismes' }">
          <UButton
            icon="i-heroicons-user"
            size="xl"
            :ui="{ rounded: 'rounded-full' }"
            :color="isHighlighted('mis-chismes') ? 'indigo' : 'gray'"
            variant="ghost"
          />
        </NuxtLink>
      </UTooltip> -->
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
    <div class="app-menu__bottom">
      <UButton
        icon="i-heroicons-question-mark-circle"
        size="xl"
        :ui="{ rounded: 'rounded-full' }"
        color="gray"
        variant="ghost"
        @click="modalsStore.openHelpModal()"
      />
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
              label="Términos y condiciones"
              @click="handleShowTermsAndConditionsEllipsisMenuClick(close)"
            />
            <UButton
              icon="i-heroicons-book-open"
              size="sm"
              color="gray"
              variant="link"
              label="Políticas de privacidad"
              @click="handleShowPrivacyPolicyEllipsisMenuClick(close)"
            />
            <UButton
              icon="i-heroicons-book-open"
              size="sm"
              color="gray"
              variant="link"
              label="Código de conducta"
              @click="handleShowRulesEllipsisMenuClick(close)"
            />
            <UButton
              icon="i-heroicons-question-mark-circle"
              size="sm"
              color="gray"
              variant="link"
              label="Botón de arrepentimiento"
              @click="handleShowRepentanceEllipsisMenuClick(close)"
            />
          </div>
        </template>
      </UPopover>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useModalsStore } from '~/stores/modals';
import { SignedIn, SignedOut} from 'vue-clerk'

const modalsStore = useModalsStore()
const route = useRoute()

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
  background-color: #0c0b22;
  height: 100%;
  padding: 1rem;
  padding-right: 2rem;
  margin-right: -1rem;
  border-radius: 1rem 0 0 1rem;
  border: 1px solid #151515;
  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    padding-right: 1.5rem;
    border-radius: 0;
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