<template>
  <div
    v-if="postToReply"
    class="app-reply-post"
  >
    <UButton
      size="xs"
      :ui="{ rounded: 'rounded-full' }"
      color="gray"
      variant="ghost"
      icon="i-heroicons-x-mark-solid"
      class="close-button"
      @click="handleCloseClick"
    >
    </UButton>
    <AppPost
      :id="postToReply.id"
      :author-avatar="postToReply.author.avatar"
      :author-username="postToReply.author.username"
      :user-id="postToReply.user_id"
      :created-at="postToReply.created_at"
      :updated-at="postToReply.updated_at"
      :text="postToReply.text"
      :fav-count="postToReply.fav_count"
      :post="postToReply"
      readonly
    />
    <AppNewPost :post-to-reply="postToReply.id"/>
  </div>
</template>

<script lang="ts" setup>
const replyStore = useReplyStore()
const modalsStore = useModalsStore()

const postToReply = computed(() => replyStore.postToReply)
function handleCloseClick() {
  modalsStore.closeReplyModal()
}
</script>

<style lang="scss" scoped>
.app-reply-post {
  display: flex;
  flex-direction: column;
  background-color: #1f1f23;
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;
  border: 1px solid #333;

  .close-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 10;
  }

  &__profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    span {
      color: #777;
      font-size: 0.8rem;
    }
  }
  &__actions {
    border-top: 1px solid #333;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>