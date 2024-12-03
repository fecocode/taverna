<script lang="ts" setup>
import { SignedIn, useAuth } from 'vue-clerk'

const route = useRoute()
const router = useRouter()
const modalsStore = useModalsStore()
const postsStore = usePostsStore()

const { action, category } = route.query

const auth = useAuth()

function removeActionParam() {
  const query = { ...route.query };
  delete query.action;
  router.push({ query });
};

const isSignInModalOpen = computed(() => modalsStore.isSignInModalOpen)
const isSignUpModalOpen = computed(() => modalsStore.isSignUpModalOpen)
const showSearchModal = ref(false)

const posts = computed(() => postsStore.mainFeed)
const isLoading = computed(() => postsStore.loadingMainFeed)

const scrollbarKey = computed(() => postsStore.mainFeed[0]?.id || 'scrollbar')

onMounted(async () => {
  if (action) {
    switch (action){
      case 'sign-in':
        if (!auth.isSignedIn.value) {
          modalsStore.openSignInModal()
        } else {
          removeActionParam()
        }
        break;
      case 'sign-up':
        if (!auth.isSignedIn.value) {
          modalsStore.openSignUpModal()
        } else {
          removeActionParam()
        }
        break;
    }
  }

  const parsedCategoryName = category ? `${category}` : undefined

  await postsStore.fetchMainFeed(parsedCategoryName)
})

watch(isSignInModalOpen, (isOpen) => {
  if (!isOpen && action === 'sign-in') {
    removeActionParam()
  }
})

watch(isSignUpModalOpen, (isOpen) => {
  if (!isOpen && action === 'sign-up') {
    removeActionParam()
  }
})

watch(() => route.query, async () => {
  const { category } = route.query

  const parsedCategoryName = category ? `${category}` : undefined

  await postsStore.fetchMainFeed(parsedCategoryName)
})
</script>

<template>
  <AppScrollbarWrapper class="scroll-bar" :key="scrollbarKey">
    <div class="posts-wrapper">
      <SignedIn>
        <AppNewPost />
      </SignedIn>
      <div class="posts-wrapper__filters lg:hidden">
        <UButton
          icon=i-heroicons-adjustments-horizontal-solid
          label="Filtrar por categoría"
          color="gray"
          size="xs"
          variant="ghost"
          :ui="{ rounded: 'rounded-full' }"
          @click="showSearchModal = true"
        />
      </div>
      <template v-if="isLoading">
        <AppSkeletonPost />
        <AppSkeletonPost />
        <AppSkeletonPost />
      </template>
      <template v-else>
        <AppPost
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
        <div v-if="posts.length === 0" class="flex justify-center items-center space-x-3 text-zinc-400  py-12">
          <UIcon name="i-heroicons-exclamation-triangle-solid" class="text-3xl" />
          <span>No posts yet</span>
        </div>
      </template>
    </div>
  </AppScrollbarWrapper>
  <UModal v-model="showSearchModal" :ui="{ container: 'flex min-h-full items-start lg:items-start justify-center text-center', width: 'w-full sm:max-w-screen-lg' }">
    <AppCategoryFilterModal @close="showSearchModal = false"/>
  </UModal>
</template>

<style lang="scss" scoped>
.scroll-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.refresh-button {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
}

.posts-wrapper {
  display: flex;
  flex-direction: column;
  padding: 0;
  position: relative;

  &__filters {
    position: sticky;
    top: -2px;
    background-color: #1f1f23;
    border-bottom: 1px solid #333;
    z-index: 10;
    width: 100%;
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: flex-end;
    @media (min-width: 1024px) {
      display: none; 
    }
  }
}
</style>