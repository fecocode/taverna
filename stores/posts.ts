import { defineStore } from 'pinia'
import { Post } from '~/classes/post.class'
import type { RAW_USER_POST_RESPONSE_DATA } from '~/types/api-spec.types'
import type { IPost } from '~/types/post.interface'

export const usePostsStore = defineStore({
  id: 'postsStore',
  state: () => ({
    mainFeed: [] as IPost[],
    usersFavPosts: [] as IPost[],
    usersPosts: [] as IPost[],

    highlightedPostId: null as string | null,

    loadingMainFeed: false,
    loadingUsersFavPosts: false,
    loadingUsersPosts: false,
  }),
  actions: {
    addNewCreatedPost(post: IPost) {
      this.mainFeed.unshift(post)
      this.usersPosts.unshift(post)
    },
    updateFavsOfPost(postId: string, favCount: number) {
      const post = this.mainFeed.find((postOnStore) => postOnStore.fav_count = favCount)
    },
    async fetchMainFeed(sharedPostId?: string) {
      const toast = useToast()

      try {
        this.loadingMainFeed = true

        if (sharedPostId) {
          const response = await $fetch<RAW_USER_POST_RESPONSE_DATA[]>(`/api/posts/${sharedPostId}`)

          this.mainFeed = response.map((rawPost) => {
            return new Post(rawPost)
          })
        } else {
          if (this.mainFeed.length === 0) {
            const response = await $fetch<RAW_USER_POST_RESPONSE_DATA[]>('/api/posts')
    
            this.mainFeed = response.map((rawPost) => {
              return new Post(rawPost)
            })
          }
        }
      } catch {
        toast.add({
          color: 'red',
          icon: 'i-heroicons-x-mark',
          title: 'Ocurrió un error al cargar nuevos chismes',
          description: 'Intenta recargar la página'
        })
      } finally {
        this.loadingMainFeed = false
      }
    },
    fetchUsersFavPosts() {

    },
    fetchUsersPosts() {

    }
  }
})
