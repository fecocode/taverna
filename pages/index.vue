<script lang="ts" setup>
import { SignedIn, useAuth } from 'vue-clerk'

const route = useRoute()
const router = useRouter()
const modalsStore = useModalsStore()
const postsStore = usePostsStore()

const { action } = route.query

const auth = useAuth()

function removeActionParam() {
  const query = { ...route.query };
  delete query.action;
  router.push({ query });
};

const isSignInModalOpen = computed(() => modalsStore.isSignInModalOpen)
const isSignUpModalOpen = computed(() => modalsStore.isSignUpModalOpen)

const posts = computed(() => postsStore.mainFeed)
const isLoading = computed(() => postsStore.loadingMainFeed)

onMounted(async () => {
  if (action) {
    switch (action){
      case 'sign-in':
        if (!auth.isSignedIn) {
          modalsStore.openSignInModal()
        } else {
          removeActionParam()
        }
        break;
      case 'sign-up':
        if (!auth.isSignedIn) {
          modalsStore.openSignUpModal()
        } else {
          removeActionParam()
        }
        break;
    }
  }

  await postsStore.fetchMainFeed()
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
  <AppScrollbarWrapper class="scroll-bar">
    <div class="posts-wrapper">
      <SignedIn>
        <AppNewPost />
      </SignedIn>
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
          :text="post.text"
          :fav-count="post.fav_count"
        />
      </template>
    </div>
  </AppScrollbarWrapper>
</template>

<style lang="scss" scoped>
.scroll-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.posts-wrapper {
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
}
</style>