import { defineStore } from 'pinia'
import { Post } from '~/classes/post.class'
import type { RAW_USER_POST_RESPONSE_DATA } from '~/types/api-spec.types'
import type { IPost } from '~/types/post.interface'

export const usePostsStore = defineStore({
  id: 'postsStore',
  state: () => ({
    mainFeed: [] as IPost[],
    newPosts: [] as IPost[],
    usersPosts: [] as IPost[],
    removedPosts: [] as IPost[],

    refreshPostsInterval: null as NodeJS.Timeout | null,

    loadingMainFeed: false,
    loadingUsersPosts: false,
  }),
  actions: {
    addNewCreatedPost(post: IPost) {
      this.mainFeed.unshift(post)
      this.usersPosts.unshift(post)
    },
    removePost(removedPost: IPost) {
      this.mainFeed = this.mainFeed.filter((storedPost) => {
        return storedPost.id !== removedPost.id
      })

      this.removedPosts.push(removedPost)
    },
    updateRecentEditedPost(editedPost: IPost) {
      const postIndex = this.mainFeed.findIndex((storedPost) => storedPost.id === editedPost.id)

      if (postIndex !== -1) {
        this.mainFeed[postIndex] = editedPost
      }
    },
    updateFavsOfPost(postId: string, favCount: number) {
      const post = this.mainFeed.find((postOnStore) => postOnStore.id === postId)
      if (post) {
        post.fav_count = favCount
      }
    },
    async fetchMainFeed(category?: string) {
      if (this.loadingMainFeed) {
        return
      }

      const toast = useToast()

      try {
        this.loadingMainFeed = true

        if (category) {
          const response = await $fetch<RAW_USER_POST_RESPONSE_DATA[]>(`/api/posts?category=${category}`)

          this.mainFeed = response.map((rawPost) => {
            return new Post(rawPost)
          })
        } else {
          const response = await $fetch<RAW_USER_POST_RESPONSE_DATA[]>('/api/posts')
  
          this.mainFeed = response.map((rawPost) => {
            return new Post(rawPost)
          })
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
    updateMainFeedPostList() {
      this.mainFeed = [...this.newPosts, ...this.mainFeed]
      this.newPosts = []
    }
  }
})
