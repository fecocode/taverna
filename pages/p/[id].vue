<template>
  <AppScrollbarWrapper class="scroll-bar">
    <div class="posts-wrapper" v-if="post">
      <AppPost
        :id="post.id"
        :author-avatar="post.author.avatar"
        :author-username="post.author.username"
        :user-id="post.user_id"
        :created-at="post.created_at"
        :updated-at="post.updated_at"
        :text="post.text"
        :fav-count="post.fav_count"
        :post="post"
        is-highlighted
      />
      <h3 v-if="post.replies && post.replies.length" class="flex space-x-3 items-center">
        <IconamoonComment class="text-yellow-400" /> 
        <span>Replies</span>
      </h3>
      <AppPost
        v-for="reply in post.replies"
        :key="reply.id"
        :id="reply.id"
        :author-avatar="reply.author.avatar"
        :author-username="reply.author.username"
        :user-id="reply.user_id"
        :created-at="reply.created_at"
        :updated-at="reply.updated_at"
        :text="reply.text"
        :fav-count="reply.fav_count"
        :post="reply"
      />
    </div>
  </AppScrollbarWrapper>
</template>

<script lang="ts" setup>
import { Post } from '@/classes/post.class'
import type { RAW_USER_POST_RESPONSE_DATA } from '~/types/api-spec.types';

const route = useRoute()
const post = ref()

onMounted(async () => {
  const postId = route.params.id

  if (postId) {
    const rawPost = await $fetch<RAW_USER_POST_RESPONSE_DATA>(`/api/posts/${postId}`)

    post.value = new Post(rawPost)
  }
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

.posts-wrapper {
  display: flex;
  flex-direction: column;
  padding: 0;
  position: relative;

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #777;
    padding: 1.5rem;
    border-bottom: 1px solid #333;
  }
}
</style>