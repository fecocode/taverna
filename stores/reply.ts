import type { IPost } from '~/types/post.interface'

import { defineStore } from 'pinia'

export const useReplyStore = defineStore({
  id: 'ReplyStore',
  state: () => ({
    postToReply: null as IPost | null,
  }),
  actions: {
    setPostToReply(post: IPost) {
      const modalsStore = useModalsStore()
      this.postToReply = post
      modalsStore.openReplyModal()
    },
    resetPostToReply() {
      this.postToReply = null
    },
    saveReply(text: string) {
      
    }
  }
})
