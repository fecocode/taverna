<template>
  <AppScrollbarWrapper class="scroll-bar">
    <div class="posts-wrapper" v-if="post">
      <div class="w-full flex justify-center py-5" v-if="parentPosts.length && !showFullDiscussion">
        <UChip :text="parentPosts.length" size="2xl" color="red">
          <UButton
            icon="i-heroicons-chat-bubble-left-right"
            size="sm"
            color="gray"
            variant="ghost"
            label="Show full discussion"
            @click="handleShowFullDiscussionClick"
          />
        </UChip>
      </div>
      <div>
        <AppPost
          v-if="showFullDiscussion"
          v-for="parent in parentPosts"
          :key="parent.id"
          :id="parent.id"
          :author-avatar="parent.author.avatar"
          :author-username="parent.author.username"
          :user-id="parent.user_id"
          :created-at="parent.created_at"
          :updated-at="parent.updated_at"
          :text="parent.text"
          :fav-count="parent.fav_count"
          :post="parent"
          enable-thread-indicator
        />
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
          enable-show-parent-post
          :enable-thread-indicator="showFullDiscussion"
          is-highlighted
        />
      </div>
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
import type { IPost } from '~/types/post.interface';

const route = useRoute()
const router = useRouter()
const post = ref()
const showFullDiscussion = ref(false)
const editStore = useEditStore()

useAsyncData(async () => {
  const postId = route.params.id

  if (postId) {
    try {
      const rawPost = await $fetch<RAW_USER_POST_RESPONSE_DATA>(`/api/posts/${postId}`)
      post.value = new Post(rawPost)
    } catch (error) {
      router.push({ name: 'index' })
    }
  }
})

onMounted(() => {
  editStore.$subscribe((e) => {
    console.log(e)
  })
})

function getParentPostsArray(post: IPost): IPost[] {
  if(!post.parent_post) {
    return []
  }

  return [...getParentPostsArray(post.parent_post), post.parent_post]
}

const parentPosts = computed(() => {
  if (post.value) {
    return getParentPostsArray(post.value)
  }

  return []
})

function handleShowFullDiscussionClick() {
  showFullDiscussion.value = true
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