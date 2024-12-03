<template>
  <div class="app-new-post">
    <UButton
      v-if="showCloseButton"
      class="close-edition-modal-button"
      size="sm"
      :ui="{ rounded: 'rounded-full' }"
      color="gray"
      variant="ghost"
      icon="i-heroicons-x-mark-solid"
      @click="modalStore.closeNewPostModal()"
    />
    <div class="app-new-post__profile">
      <UAvatar :src="userImage" size="xs" />
      <span><b>@{{ userName }}</b></span>
    </div>
    <div class="flex space-x-0">
      <UInput type="file" class="hidden" v-model="fileInputValue" ref="fileInput" accept="image/*" @change="handleFileUploadChange" />
      <UButton
        v-if="showCategorySelectorButton"
        color="gray"
        variant="ghost"
        label="Add category"
        icon="i-heroicons-hashtag-16-solid"
        size="2xs"
        @click="showSelectCategoryModal = true"
      />
      <UButton
        v-else-if="postSelectedCategory"
        color="yellow"
        variant="soft"
        :label="postSelectedCategory"
        icon="i-heroicons-hashtag-16-solid"
        size="2xs"
        @click="postSelectedCategory = undefined"
      >
        <template #trailing>
          <UIcon name="i-heroicons-x-mark-solid" class="text-white font-sm ml-2" />
        </template>
      </UButton>
      <UButton
        v-if="!imagePreview"
        color="gray"
        variant="ghost"
        label="Add picture"
        icon="i-heroicons-photo-16-solid"
        size="2xs"
        @click="handleUploadImageClick"
      />
    </div>
    <div class="app-new-post__editor">
      <editor-content :editor="editor" class="editor-content" />
    </div>
    <div class="app-new-post__image-preview" v-if="imagePreview" ref="previewImageElement" :style="maxPreviewImageHeightStyle">
      <UTooltip class="close-button" :popper="{ placement: 'right'}" text="Remove">
        <UButton
          size="xs"
          :ui="{ rounded: 'rounded-full' }"
          color="gray"
          variant="soft"
          icon="i-heroicons-x-mark-solid"
          @click="handleRemoveImage"
        />
      </UTooltip>
      <img :src="imagePreview" :onload="handlePreviewLoad" />
    </div>
    <div class="app-new-post__actions">
      <div class="app-new-post__actions__characters-counter">
        {{ characterCount }}
      </div>
      <UButton
        color="black"
        :label="publishButtonText"
        size="sm"
        :disabled="!canSave"
        :loading="publishing"
        @click="publishPost"
      >
      </UButton>
    </div>
  </div>
  <UModal v-model="showSelectCategoryModal" :ui="{ container: 'flex min-h-full items-start lg:items-start justify-center text-center', width: 'w-full sm:max-w-screen-lg' }">
    <AppCategorySelectorModal @close="showSelectCategoryModal = false" @select="handleSelectCategory" />
  </UModal>
</template>

<script lang="ts" setup>
import { EditorContent, getText, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'
import DOMPurify from 'dompurify'

import { useSession } from 'vue-clerk'
import type { RAW_CREATE_USER_POST_REQUEST_BODY, RAW_USER_POST_RESPONSE_DATA } from '~/types/api-spec.types'
import { Post } from '~/classes/post.class'
import { getRouteOfCategory } from '~/constants/supported-post-categories.constants'

const props = defineProps<{
  postToReply?: string,
  showCloseButton?: boolean,
}>()

const { session } = useSession()
const toast = useToast()
const modalStore = useModalsStore()

const userImage = computed(() => session.value?.user.imageUrl || '')
const userName = computed(() => session.value?.user.username || '')
const replyStore = useReplyStore()

const publishing = ref(false)

const limit = 5000;

const showSelectCategoryModal = ref(false)
const postSelectedCategory = ref()
const postsStore = usePostsStore()
const fileToUpload = ref()
const fileInputValue = ref()

const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: props.postToReply ? 'Write your reply here...' : 'Write your post here...',
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

const imagePreview = ref()
const fileInput = ref()
const previewImageElement = ref()
const maxPreviewImageHeight = ref('')


const characterCount = computed(() => {
  const characters = editor.value?.storage.characterCount.characters() || 0

  return `${characters} / ${limit}`
})

const showCategorySelectorButton = computed(() => {
  return !props.postToReply && !postSelectedCategory.value
})

const canSave = computed(() => {
  return editor.value?.storage.characterCount.characters() > 0
})

const publishButtonText = computed(() => {
  return props.postToReply ? 'Reply' : 'Post'
})

const maxPreviewImageHeightStyle = computed(() => {
  return `--preview-image-max-height: ${maxPreviewImageHeight.value}px;`
})

onUnmounted(() => {
  editor.value?.destroy()
})

function handlePreviewLoad() {
  const {width} = previewImageElement?.value?.getBoundingClientRect() || 0

  maxPreviewImageHeight.value = `${16 * width / 9}`
}

function handleFileUploadChange(fileList: FileList) {
  const [file] = fileList

  if (file && file.type.startsWith('image/')) {
    if(file.size / 1024 / 1024 > 5) {
      toast.add({
        color: 'red',
        icon: 'i-heroicons-x-mark',
        title: `File Size Exceeds Limit`,
        description: 'Please upload a file smaller than 5 MB.'
      })

      return
    }

    fileToUpload.value = file
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result;
    };
    reader.readAsDataURL(file);
  } 
}

function handleSelectCategory(category: string) {
  postSelectedCategory.value = category
  showSelectCategoryModal.value = false
}

function handleRemoveImage() {
  fileInputValue.value = null
  imagePreview.value = null
  fileToUpload.value = null
}

function handleUploadImageClick() {
  if (fileInput.value?.input) {
    fileInput.value.input.click()
  }
}

async function publishPost() {
  if(!canSave) {
    return
  }

  if (editor.value) {
    try {
      publishing.value = true

      const formData = new FormData()

      formData.append('text', editor.value.getHTML())

      if (props.postToReply) {
        formData.append('parent_post_id', props.postToReply)
      }

      if (fileToUpload.value) {
        formData.append('picture', fileToUpload.value)
      }

      if (postSelectedCategory.value) {
        formData.append('category', postSelectedCategory.value ? getRouteOfCategory(postSelectedCategory.value) : '')
      }
  
      const response = await useFetch<RAW_USER_POST_RESPONSE_DATA>('/api/posts', {
        method: 'POST',
        body: formData,
      })
      
      if (!props.postToReply) {
        const newPost = new Post(response.data.value!)
        postsStore.addNewCreatedPost(newPost)
        modalStore.closeNewPostModal()
        toast.add({
          color: 'green',
          icon: 'i-heroicons-check',
          title: 'Your post has been published',
        })
      } else {
        if (replyStore.postToReply?.replies) {
          const reply = new Post(response.data.value!)
          replyStore.postToReply?.replies?.unshift(reply)
        }
        modalStore.closeReplyModal()
        toast.add({
          color: 'green',
          icon: 'i-heroicons-check',
          title: 'Your reply has been published',
        })
      }

      
      editor.value.commands.clearContent()
    } catch (error) {
      console.error(error)
      toast.add({
        color: 'red',
        icon: 'i-heroicons-x-mark',
        title: `An error occurred`,
        description: 'Please, try again in a few seconds'
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

  &:deep {
    outline: none;
  }
}


.app-new-post {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #242429;
  border-bottom: 1px solid #333;

  .close-edition-modal-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  &:last-child {
    border-bottom: none;
  }

  &:only-child {
    border-radius: 0.5rem;
    border: 1px solid #333;
  }

  &__image-preview {
    --preview-image-max-height: 0;
    display: flex;
    max-width: 450px;
    width: 100%;
    margin: 1rem auto;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 0.5rem;
    box-shadow: 0 0 1rem -0.5rem #111;
    background-color: #111;
    position: relative;
    max-height: var(--preview-image-max-height);
    img {
      width: 100%;
    }
    .close-button {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
    }
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