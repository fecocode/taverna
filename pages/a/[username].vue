<template>
  <AppScrollbarWrapper class="scroll-bar">
    <div class="profile-page" v-if="authorData">
    <div class="profile-page__author">
      <div class="profile-page__author__data">
          <UAvatar :src="authorData.avatar" size="3xl" />
          <h3>{{ authorData.username }}</h3>
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

const authorData = ref<RAW_AUTHOR_RESPONSE_DATA>()
const route = useRoute()
useAsyncData(async() => {
  const username = route.params.username

  if (username) {
    authorData.value = await $fetch(`/api/authors/${username}`)
  }
})

const posts = computed(() => {
  return authorData.value?.posts.map((rawPost) => new Post(rawPost))
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

.profile-page {
  &__author {
    display: flex;
    background-color: #242429;
    position: relative;
    border-bottom: 1px solid #333;
    &__data {
      display: flex;
      flex-direction: column;
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