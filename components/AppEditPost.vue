<template>
  <div class="app-edit-post">
    <div class="app-edit-post__profile">
      <UAvatar :src="userImage" size="xs" />
      <span><b>@{{ userName }}</b></span>
    </div>
    <div class="app-edit-post__editor">
      <editor-content :editor="editor" class="editor-content" />
    </div>
    <div class="app-edit-post__actions">
      <div class="app-edit-post__actions__characters-counter">
        {{ characterCount }}
      </div>
      <UButton
        color="black"
        label="Save post"
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
import Link from '@tiptap/extension-link'
import DOMPurify from 'dompurify'

import { useSession } from 'vue-clerk'

const { session } = useSession()
const toast = useToast()
const modalStore = useModalsStore()
const editStore = useEditStore()

const userImage = computed(() => session.value?.user.imageUrl || '')
const userName = computed(() => session.value?.user.username || '')
const postToEdit = computed(() => editStore.postToEdit)

const publishing = computed(() => editStore.updating)

const limit = 5000;

const postsStore = usePostsStore()

const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Write your post here...',
    }),
    CharacterCount.configure({
      limit: limit,
    }),
    Link.configure({
      openOnClick: true,
      linkOnPaste: true,
    })
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

onMounted(() => {
  if (editor.value && postToEdit.value) {
    const currentContentToEdit = `${postToEdit.value.text}`
    editor.value.commands.clearContent()
    editor.value.commands.insertContent(currentContentToEdit)
  } else {
    toast.add({
      color: 'red',
      icon: 'i-heroicons-x-mark',
      title: 'Ocurrió un error al intentar la edición',
      description: 'Intenta recargar la página'
    })
    modalStore.closeEditPostModal()
  }
})

onUnmounted(() => {
  editor.value?.destroy()
})

async function publishPost() {
  if(!canSave) {
    return
  }

  if (editor.value) {
    const sanitizedContent = DOMPurify.sanitize(editor.value.getHTML(), {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
    });
    await editStore.saveEditedPost(sanitizedContent)
  }
}
</script>

<style lang="scss" scoped>
.editor-content {
  outline: none;

  &:focus {
    outline: none;
  }

  &:deep {
    outline: none;
  }
}


.app-edit-post {
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