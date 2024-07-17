import { defineStore } from 'pinia'
import type { IPost } from '~/types/post.interface'

export const useEditStore = defineStore({
  id: 'editStore',
  state: () => ({
    postToEdit: null as IPost | null,
    postToDelete: null as IPost | null,

    deleting: false,
    updating: false,
  }),
  actions: {
    setPostToDelete(post: IPost) {
      const modalsStore = useModalsStore()
      this.postToDelete = post
      modalsStore.openDeletePostModal()
    },
    resetPostToDelete() {
      this.postToDelete = null
    },
    setPostToEdit(post: IPost) {
      this.postToEdit = post
    },
    resetPostToEdit() {
      this.postToEdit = null
    },

    async deletePost() {
      if (!this.postToDelete) {
        return
      }

      const toast = useToast()
      const favsStore = useFavsStore()
      const postsStore = usePostsStore()
      const modalsStore = useModalsStore()

      try {
        this.deleting = true

        await $fetch(`/api/posts/${this.postToDelete.id}`, {
          method: 'DELETE'
        })

        favsStore.removeFavPost(this.postToDelete)
        postsStore.removePost(this.postToDelete)

        this.postToDelete = null

        modalsStore.closeDeletePostModal()

        toast.add({
          color: 'green',
          icon: 'i-heroicons-check',
          title: 'Se eliminó tu chisme',
        })
      } catch (_) {
        modalsStore.closeDeletePostModal()

        toast.add({
          color: 'red',
          icon: 'i-heroicons-x-mark',
          title: 'Ocurrió un error al eliminar',
          description: 'Intenta nuevamente en unos minutos'
        })
      } finally {
        this.deleting = false
      }
    }
  }
})
