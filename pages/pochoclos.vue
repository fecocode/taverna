<template>
  <AppScrollbarWrapper class="scroll-bar">
    <div class="users-fav">
      <h3><span class="text-indigo-500">#</span> Tus pochoclos</h3>
      <SignedIn>
        <div class="users-fav__loading-indicator" v-if="favsStore.loadingFavs">
          <IconSvgSpinners3DotsScale />
        </div>
        <template v-if="isLoading">
          <AppSkeletonPost />
          <AppSkeletonPost />
          <AppSkeletonPost />
        </template>
        <div v-else-if="posts.length === 0" class="users-fav__empty">
          <IconLineMdCoffeeHalfEmptyTwotoneLoop class="icon" />
          <p>No se encontraron resultados</p>
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
        />
      </SignedIn>
      <SignedOut>
        <div class="users-fav__signed-out">
          <IconLineMdAlertCircle class="icon" />
          <p>Si querés guardar chismes para pochoclear, necesitás una cuenta de <strong>Chismecito</strong></p>
          <UButton color="indigo" size="xl" label="Crear cuenta" @click="modalStore.openSignUpModal()" />
        </div>
      </SignedOut>
    </div>
  </AppScrollbarWrapper>
</template>

<script lang="ts" setup>
import { SignedOut, SignedIn } from 'vue-clerk'

const favsStore = useFavsStore()
const modalStore = useModalsStore()
const isLoading = computed(() => favsStore.loadingFavs && favsStore.userFavs.length === 0)
const posts = computed(() => favsStore.userFavs)

onMounted(async () => {
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
    font-size: 1.5rem;
    font-weight: 600;
    color: #777;
    margin: 1.5rem 0;
    padding: 0 1rem;
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
    }

    .icon {
      font-size: 5rem;
    }
  }
}
</style>