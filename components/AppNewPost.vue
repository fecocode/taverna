<template>
  <div class="app-new-post">
    <div class="app-new-post__profile">
      <UAvatar :src="userImage" size="xs" />
      <span><b>@{{ userName }}</b></span>
    </div>
    <div class="app-new-post__editor">
      <editor-content :editor="editor" class="editor-content" />
    </div>
    <div class="app-new-post__actions">
      <div class="app-new-post__actions__characters-counter">
        {{ characterCount }}
      </div>
      <UButton
        color="indigo"
        label="Publicar"
        size="sm"
        :disabled="!canSave"
        :loading="publishing"
        @click="publishPost"
      >
      </UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EditorContent, getText, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import DOMPurify from 'dompurify'

import { useSession } from 'vue-clerk'
import type { RAW_CREATE_USER_POST_REQUEST_BODY, RAW_USER_POST_RESPONSE_DATA } from '~/types/api-spec.types'
import { Post } from '~/classes/post.class'

const { session } = useSession()
const toast = useToast()
const modalStore = useModalsStore()

const userImage = computed(() => session.value?.user.imageUrl || '')
const userName = computed(() => session.value?.user.username || '')

const publishing = ref(false)

const limit = 5000;

const postsStore = usePostsStore()

const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Escribí tu chisme acá...',
    }),
    CharacterCount.configure({
      limit: limit,
    }),
  ],
  content: '<p></p>',
})

const characterCount = computed(() => {
  const characters = editor.value?.storage.characterCount.characters() || 0

  return `${characters} / ${limit}`
})

const canSave = computed(() => {
  return editor.value?.storage.characterCount.characters() > 0
})

onUnmounted(() => {
  editor.value?.destroy()
})

async function publishPost() {
  if(!canSave) {
    return
  }

  if (editor.value) {
    try {
      publishing.value = true
      
      // const sanitizedContent = DOMPurify.sanitize(editor.value.getHTML(), {
      //   ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      //   ALLOWED_ATTR: ['href', 'target'],
      // });

      const requestBody: RAW_CREATE_USER_POST_REQUEST_BODY = {
        text: editor.value.getHTML()
      }
  
      const response = await useFetch<RAW_USER_POST_RESPONSE_DATA>('/api/posts', {
        method: 'POST',
        body: requestBody,
      })

      const newPost = new Post(response.data.value!)

      postsStore.addNewCreatedPost(newPost)
      editor.value.commands.clearContent()

      toast.add({
        color: 'green',
        icon: 'i-heroicons-check',
        title: 'Se publicó tu chisme',
      })

      modalStore.closeNewPostModal()
    } catch (error) {
      console.error(error)
      toast.add({
        color: 'red',
        icon: 'i-heroicons-x-mark',
        title: 'Ocurrió un error al publicar',
        description: 'Intentalo nuevamente en unos minutos'
      })
    } finally {
      publishing.value = false
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-content {
  outline: none;

  &:focus {
    outline: none;
  }

  &::v-deep {
    outline: none;
  }
}


.app-new-post {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #242429;
  border-radius: 0.5rem;

  @media (max-width: 768px) {
    border-radius: 0;
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