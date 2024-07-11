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

import { useSession } from 'vue-clerk'

const { session } = useSession()

const userImage = computed(() => session.value?.user.imageUrl || '')
const userName = computed(() => session.value?.user.username || '')

const limit = 5000;

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

onUnmounted(() => {
  editor.value?.destroy()
})

async function publishPost() {
  await useFetch('/api/posts', {
    method: 'POST',
    body: {
      test: 'test'
    },
  })
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