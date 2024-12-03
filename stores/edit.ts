import { defineStore } from 'pinia'
import type { IPost } from '~/types/post.interface'
import type { PARTIAL_RAW_USER_POST_UPDATED_DATA } from '~/types/api-spec.types'

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
      const modalsStore = useModalsStore()
      this.postToEdit = {...post} // Make a copy
      modalsStore.openEditPostModal()
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
      const triggerStore = useTriggerStore()

      try {
        this.deleting = true

        await $fetch(`/api/posts/${this.postToDelete.id}`, {
          method: 'DELETE'
        })

        favsStore.removeFavPost(this.postToDelete)
        postsStore.removePost(this.postToDelete)

        triggerStore.addNewTrigger({
          name: 'delete-post',
          data: {
            postId: this.postToDelete.id
          }
        })

        this.postToDelete = null

        modalsStore.closeDeletePostModal()

        toast.add({
          color: 'green',
          icon: 'i-heroicons-check',
          title: 'Se borró tu post',
        })
      } catch (_) {
        modalsStore.closeDeletePostModal()

        toast.add({
          color: 'red',
          icon: 'i-heroicons-x-mark',
          title: 'Ocurrió un error',
          description: 'Intentalo nuevamente en algunos minutos'
        })
      } finally {
        this.deleting = false
      }
    },

    async saveEditedPost(newContent: string, newImage?: File, category?: string) {
      if (!this.postToEdit) {
        return
      }

      const toast = useToast()
      const favsStore = useFavsStore()
      const postsStore = usePostsStore()
      const modalsStore = useModalsStore()
      const triggerStore = useTriggerStore()

      try {
        this.updating = true

        const formData = new FormData()

        formData.append('text', newContent)

        if (newImage) {
          formData.append('picture', newImage)
        }

        if (!newImage && !this.postToEdit.picture_url) {
          formData.append('empty_image_field', 'true')
        }

        if (category) {
          formData.append('category', category)
        }

        const resultOfUpdate: PARTIAL_RAW_USER_POST_UPDATED_DATA =  await $fetch(`/api/posts/${this.postToEdit.id}`, {
          method: 'PATCH',
          body: formData
        })

        this.postToEdit.text = resultOfUpdate.text
        this.postToEdit.picture_url = resultOfUpdate.picture_url
        this.postToEdit.updated_at = resultOfUpdate.updated_at
        this.postToEdit.category = resultOfUpdate.category || undefined

        favsStore.updateRecentEditedFavPost(this.postToEdit)
        postsStore.updateRecentEditedPost(this.postToEdit)

        triggerStore.addNewTrigger({
          name: 'update-post',
          data: {
            postId: this.postToEdit.id,
            newPostData: this.postToEdit
          }
        })

        this.postToEdit = null

        modalsStore.closeEditPostModal()


        toast.add({
          color: 'green',
          icon: 'i-heroicons-check',
          title: 'Se guardó tu post con éxito',
        })
      } catch (_) {
        modalsStore.closeEditPostModal()

        toast.add({
          color: 'red',
          icon: 'i-heroicons-x-mark',
          title: `Ocurrió un error`,
          description: 'Por favor, intentalo en unos minutos nuevamente'
        })
      } finally {
        this.updating = false
      }
    }
  }
})
