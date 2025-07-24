<template>
  <AppScrollbarWrapper class="scroll-bar">
    <div class="users-fav">
      <h3 class="flex space-x-3 items-center border-b border-zinc-700">
        <UIcon name="i-heroicons-heart-20-solid" class="text-yellow-400" />
        <span>Posts que te gustaron</span>
      </h3>
      <SignedIn>
        <template v-if="isLoading">
          <AppSkeletonPost />
          <AppSkeletonPost />
          <AppSkeletonPost />
        </template>
        <div v-else-if="posts.length === 0" class="users-fav__empty">
          <div v-if="posts.length === 0" class="flex justify-center items-center space-x-3 text-zinc-400 py-5">
            <UIcon name="i-heroicons-exclamation-triangle-solid" class="text-3xl" />
            <span>Aún no hay nada por acá</span>
          </div>
          <NuxtLink :to="{ name: 'index' }">
            <UButton
              class="mt-3"
              icon="i-heroicons-home"
              label="Ir a la página principal"
              color="gray"
              variant="ghost"
              size="xs"
            />
          </NuxtLink>
        </div>
        <AppPost v-else
          v-for="post in posts"
          :key="post.id"
          :id="post.id"
          :author-avatar="post.author.avatar"
          :author-username="post.author.username"
          :user-id="post.user_id"
          :created-at="post.created_at"
          :updated-at="post.updated_at"
          :text="post.text"
          :fav-count="post.fav_count"
          :post="post"
          enable-show-parent-post
        />
      </SignedIn>
      <SignedOut>
        <div class="users-fav__signed-out">
          <IconLineMdAlertCircle class="icon" />
          <p>Necesitás una cuenta para indicar que un posts te gusta.</p>
          <UButton color="black" size="xl" label="Crear cuenta" @click="modalStore.openSignUpModal()" />
        </div>
      </SignedOut>
    </div>
  </AppScrollbarWrapper>
</template>

<script lang="ts" setup>
import { SignedOut, SignedIn, useAuth } from 'vue-clerk'

const favsStore = useFavsStore()
const modalStore = useModalsStore()
const isLoading = computed(() => favsStore.loadingFavs && favsStore.userFavs.length === 0)
const posts = computed(() => favsStore.userFavs)
const auth = useAuth()

onMounted(async () => {
  if (!auth.isSignedIn.value) {
    return
  }
  await favsStore.fetchUserFavPosts()
})
</script>

<style lang="scss" scoped>
.scroll-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.users-fav {
  display: flex;
  flex-direction: column;

  &__loading-indicator {
    font-size: 2rem;
    color: #fff;
    display: flex;
    justify-content: center;
    padding: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #777;
    padding: 1.5rem;
  }
  &__empty, &__signed-out {
    color: #777;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 3rem 0;
    gap: 1rem;

    p {
      max-width: 350px;
      text-align: center;
      font-size: 1.25rem;
    }

    .icon {
      font-size: 6rem;
    }
  }
}
</style>