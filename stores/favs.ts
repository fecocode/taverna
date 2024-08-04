import { defineStore } from 'pinia'
import type { RAW_UNFAV_RESPONSE, RAW_USER_POST_RESPONSE_DATA } from '~/types/api-spec.types'
import type { RAW_NEW_FAV_STORED_RESPONSE } from '@/types/api-spec.types'
import type { IPost } from '~/types/post.interface'
import { Post } from '~/classes/post.class'

export const useFavsStore = defineStore({
  id: 'FavsStore',
  state: () => ({ 
    userFavsIds: [] as string[],
    userFavs: [] as IPost[],

    loadingFavsIds: false,
    loadingFavs: false,
   }),
  actions: {
    removeFavPost(removedPost: IPost) {
      this.userFavs = this.userFavs.filter((storedPost) => {
        return storedPost.id !== removedPost.id
      })
    },
    updateRecentEditedFavPost(editedPost: IPost) {
      const postIndex = this.userFavs.findIndex((storedPost) => storedPost.id === editedPost.id)

      if (postIndex !== -1) {
        this.userFavs[postIndex] = editedPost
      }
    },
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
      this.userFavs = this.userFavs.filter((fav) => fav.id !== response.post_id)
    },
    async fetchUserFavsIds() {
      if (this.loadingFavsIds) {
        return
      }
      const toast = useToast()

      try {
        this.loadingFavsIds = true
        this.userFavsIds = await $fetch<string[]>('/api/user/get-favs-ids')
      } catch(_) {
        toast.add({
          color: 'red',
          icon: 'i-heroicons-x-mark',
          title: 'Ocurrió un error en la carga',
          description: 'Intenta recargar la página'
        })
      } finally {
        this.loadingFavsIds = false
      }
    },
    async fetchUserFavPosts() {
      if (this.loadingFavs) {
        return
      }

      const toast = useToast()

      try {
        this.loadingFavs = true

        if (this.userFavsIds.length === 0) {
          await this.fetchUserFavsIds()
        }

        const response = await $fetch<RAW_USER_POST_RESPONSE_DATA[]>('/api/user/get-favs')
  
        this.userFavs = response.map((rawPost) => new Post(rawPost))
      } catch (_) {
        toast.add({
          color: 'red',
          icon: 'i-heroicons-x-mark',
          title: 'Ocurrió un error al cargar tus pochoclos',
          description: 'Intenta recargar la página'
        })
      } finally {
        this.loadingFavs = false
      }
    },
  },
  getters: {
    parsedUserFavsPostsIds: (state) => {
      return state.userFavsIds.map((favId) => favId.split(':')[1])
    }
  }
})
