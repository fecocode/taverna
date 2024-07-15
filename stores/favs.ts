import { defineStore } from 'pinia'
import type { RAW_UNFAV_RESPONSE, RAW_USER_POST_RESPONSE_DATA } from '~/types/api-spec.types'
import type { RAW_NEW_FAV_STORED_RESPONSE } from '@/types/api-spec.types'

export const useFavsStore = defineStore({
  id: 'FavsStore',
  state: () => ({ 
    userFavsIds: [] as string[],
    userFavs: [] as RAW_USER_POST_RESPONSE_DATA[],
   }),
  actions: {
    async setAsFavPost(postId: string) {
      const response = await $fetch<RAW_NEW_FAV_STORED_RESPONSE>(`/api/posts/${postId}/fav`, {
        method: 'POST'
      })

      this.userFavsIds.push(response.id)
    },
    async unfavPost(postId: string) {
      const response = await $fetch<RAW_UNFAV_RESPONSE>(`/api/posts/${postId}/unfav`, {
        method: 'POST'
      })

      this.userFavsIds = this.userFavsIds.filter((favId) => favId !== response.id)
    }
  },
  getters: {
    parsedUserFavsPostsIds: (state) => {
      return state.userFavsIds.map((favId) => favId.split(':')[1])
    }
  }
})
