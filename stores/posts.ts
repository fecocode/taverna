import { defineStore } from 'pinia'
import type { IPost } from '~/types/post.interface'

export const usePostsStore = defineStore({
  id: 'postsStore',
  state: () => ({
    mainFeed: [] as IPost[],
    usersFavPosts: [] as IPost[],
    usersPosts: [] as IPost[],

    loadingMainFeed: false,
    loadingUsersFavPosts: false,
    loadingUsersPosts: false,
  }),
  actions: {
    addNewCreatedPost(post: IPost) {
      this.mainFeed.unshift(post)
      this.usersPosts.unshift(post)
    },
    fetchMainFeed() {

    },
    fetchUsersFavPosts() {

    },
    fetchUsersPosts() {

    }
  }
})
