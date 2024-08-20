<template>
  <AppScrollbarWrapper class="scroll-bar">
    <template v-if="loading">
      <AppSkeletonAuthor />
      <AppSkeletonPost />
      <AppSkeletonPost />
      <AppSkeletonPost />
    </template>
    <div class="profile-page" v-if="authorData">
      <div class="profile-page__author">
        <UButton
          v-if="showFollowButton"
          class="profile-page__author__follow-button"
          color="black"
          :variant="isFollowing ? 'outline' : 'solid'"
          :label="isFollowing ? 'Unfollow' : 'Follow'"
          :loading="followingLoading"
          @click="handleFollowButtonClick"
        />
        <div class="profile-page__author__data">
          <UAvatar :src="authorData.avatar" size="3xl" />
          <div class="flex space-x-2 items-center">
            <h3>{{ authorData.username }}</h3>
            <UBadge v-if="authorData.follow_me" size="xs" color="gray">Follows you</UBadge>
          </div>
          <div class="text-xs">
            {{ followersText }}
          </div>
        </div>
      </div>
    </div>
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
      enable-show-parent-post
    />
  </AppScrollbarWrapper>
</template>

<script lang="ts" setup>
import type { RAW_AUTHOR_RESPONSE_DATA } from '@/types/api-spec.types'
import { Post } from '~/classes/post.class';
import type { IPost } from '~/types/post.interface';
import { useSession } from 'vue-clerk';

const authorData = ref<RAW_AUTHOR_RESPONSE_DATA>()
const route = useRoute()
const triggerStore = useTriggerStore()
const posts = ref<IPost[]>([])
const loading = ref(false)
const followingLoading = ref(false)
useAsyncData(async() => {
  loading.value = true
  const username = route.params.username
  try {
    if (username) {
      authorData.value = await $fetch(`/api/authors/${username}`)
      if (!authorData.value) return
      posts.value = authorData.value?.posts.map((rawPost) => new Post(rawPost))
    }
  } catch(_) {

  } finally {
    loading.value = false
  }
})

const followersText = computed(() => {
  if (!authorData.value) return ''

  return `${abbreviateNumber(authorData.value.followers)} ${authorData.value.followers === 1 ? 'Follower' : 'Followers'}`
})

const isFollowing = computed(() => {
  return authorData.value?.following
})

const showFollowButton = computed(() => {
  const { session } = useSession()

  if (!session.value?.user || !route.params.username) return false 

  return route.params.username !== session.value?.user?.username
})

onMounted(() => {
  triggerStore.$subscribe(() => {
    const [lastTrigger] = triggerStore.triggers.slice(-1)

    if (lastTrigger.name === 'delete-post') {
      const deletedPostInUserPosts = posts.value.findIndex((post) => post.id === lastTrigger.data.postId)

      if (deletedPostInUserPosts !== -1) {
        const postToDelete = posts.value[deletedPostInUserPosts]

        if (postToDelete.parent_post_id) {
          const foundedParentPost = posts.value.find((p) => p.id === postToDelete.parent_post_id)

          if (foundedParentPost) {
            foundedParentPost.replies_count --
          }
        }
        posts.value.splice(deletedPostInUserPosts, 1)
      }
    }

    if (lastTrigger.name === 'update-post') {
      const editedPostIndexInUserPostsArray = posts.value.findIndex((post) => post.id === lastTrigger.data.postId)

      if (editedPostIndexInUserPostsArray !== -1) {
        posts.value[editedPostIndexInUserPostsArray].text = lastTrigger.data.newPostData.text
        posts.value[editedPostIndexInUserPostsArray].updated_at = lastTrigger.data.newPostData.updated_at
      }
    }
  })
})

function abbreviateNumber(value:number) {
  if (value >= 1e6) {
    return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (value >= 1e3) {
    return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return value?.toString() || '';
}

async function handleFollowButtonClick() {
  if (!authorData.value) return

  if (isFollowing.value) {
    try {
      followingLoading.value = true
      await useFetch(`/api/authors/${authorData.value.id}/unfollow`, {
        method: 'post'
      })

      authorData.value.followers --
      authorData.value.following = false
    } catch(_) {

    } finally {
      followingLoading.value = false
    }
  } else {
    try {
      followingLoading.value = true
      await useFetch(`/api/authors/${authorData.value.id}/follow`, {
        method: 'post'
      })
      authorData.value.followers ++
      authorData.value.following = true
    } catch(_) {

    } finally {
      followingLoading.value = false
    }
  }
}

</script>

<style lang="scss" scoped>
.scroll-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.profile-page {
  &__author {
    display: flex;
    background-color: #242429;
    position: relative;
    border-bottom: 1px solid #333;
    &__follow-button {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
    }
    &__data {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      h3 {
        font-size: 1.15rem;
        font-weight: 500;
        &::before {
          content: '@'
        }
      }
    }
  }
}

</style>