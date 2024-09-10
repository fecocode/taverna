<script lang="ts" setup>
import { SignedIn, useAuth } from 'vue-clerk'

const route = useRoute()
const router = useRouter()
const modalsStore = useModalsStore()
const postsStore = usePostsStore()

const { action, shared } = route.query

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
const thereAreNewPosts = computed(() => postsStore.newPosts.length > 0)

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

  if (shared) {
    await postsStore.fetchMainFeed(`${shared}`)
  } else {
    await postsStore.fetchMainFeed()
  }
})

onUnmounted(() => {
  postsStore.clearRefreshInterval()
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
          label="Filter by category"
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
      </template>
    </div>
  </AppScrollbarWrapper>
  <UButton
    v-if="thereAreNewPosts"
    label="New posts"
    color="yellow"
    class="refresh-button"
    icon="i-heroicons-arrow-small-up"
    size="xs"
    @click="postsStore.updateMainFeedPostList()"
  />
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