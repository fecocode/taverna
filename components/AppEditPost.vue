<template>
  <div class="app-edit-post">
    <UButton
      class="close-edition-modal-button"
      size="sm"
      :ui="{ rounded: 'rounded-full' }"
      color="gray"
      variant="ghost"
      icon="i-heroicons-x-mark-solid"
      @click="modalStore.closeEditPostModal()"
    />
    <div class="app-edit-post__profile">
      <UAvatar :src="userImage" size="xs" />
      <span><b>@{{ userName }}</b></span>
    </div>
    <div class="flex space-x-1">
      <UInput type="file" class="hidden" v-model="fileInputValue" ref="fileInput" accept="image/*" @change="handleFileUploadChange" />
      <UButton
        v-if="showCategorySelectorButton"
        color="gray"
        variant="ghost"
        label="Agregar categoría"
        icon="i-heroicons-hashtag-16-solid"
        size="2xs"
        @click="showSelectCategoryModal = true"
      />
      <UButton
        v-else-if="postSelectedCategory"
        color="sky"
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
        label="Agregar imagen"
        icon="i-heroicons-photo-16-solid"
        size="2xs"
        @click="handleUploadImageClick"
      />
    </div>
    <div class="app-edit-post__editor">
      <editor-content :editor="editor" class="editor-content" />
    </div>
    <div class="app-edit-post__image-preview" v-if="imagePreview" ref="previewImageElement" :style="maxPreviewImageHeightStyle">
      <UTooltip class="close-button" :popper="{ placement: 'right'}" text="Quitar">
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
    <div class="app-edit-post__actions">
      <div class="app-edit-post__actions__characters-counter">
        {{ characterCount }}
      </div>
      <UButton
        color="black"
        label="Publicar edición"
        size="sm"
        :disabled="!canSave"
        :loading="publishing"
        @click="publishPost"
      />
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
import { getRouteOfCategory } from '~/constants/supported-post-categories.constants'

const { session } = useSession()
const toast = useToast()
const modalStore = useModalsStore()
const editStore = useEditStore()

const userImage = computed(() => session.value?.user.imageUrl || '')
const userName = computed(() => session.value?.user.username || '')
const postToEdit = computed(() => editStore.postToEdit)

const publishing = computed(() => editStore.updating)

const limit = 1986;

const postsStore = usePostsStore()
const fileToUpload = ref()
const fileInputValue = ref()

const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Escribí tu post acá...',
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
const showSelectCategoryModal = ref(false)
const postSelectedCategory = ref()

const characterCount = computed(() => {
  const characters = editor.value?.storage.characterCount.characters() || 0

  return `${characters} / ${limit}`
})

const canSave = computed(() => {
  return editor.value?.storage.characterCount.characters() > 0
})

const maxPreviewImageHeightStyle = computed(() => {
  return `--preview-image-max-height: ${maxPreviewImageHeight.value}px;`
})


const showCategorySelectorButton = computed(() => {
  return !postToEdit.value?.parent_post_id && !postSelectedCategory.value
})

function handleSelectCategory(category: string) {
  postSelectedCategory.value = category
  showSelectCategoryModal.value = false
}

function handleFileUploadChange(fileList: FileList) {
  const [file] = fileList

  if (file && file.type.startsWith('image/')) {
    if(file.size / 1024 / 1024 > 5) {
      toast.add({
        color: 'red',
        icon: 'i-heroicons-x-mark',
        title: `El archivo es muy grande`,
        description: 'Por favor subí un archivo de menos de 5 MB.'
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


function handleRemoveImage() {
  if (postToEdit.value) {
    postToEdit.value.picture_url = undefined
  }
  fileInputValue.value = null
  imagePreview.value = null
  fileToUpload.value = null
}

function handleUploadImageClick() {
  if (fileInput.value?.input) {
    fileInput.value.input.click()
  }
}

function handlePreviewLoad() {
  const {width} = previewImageElement?.value?.getBoundingClientRect() || 0

  maxPreviewImageHeight.value = `${16 * width / 9}`
}
onMounted(() => {
  if (editor.value && postToEdit.value) {
    const currentContentToEdit = `${postToEdit.value.text}`
    editor.value.commands.clearContent()
    editor.value.commands.insertContent(currentContentToEdit)
    if (postToEdit.value.picture_url) {
      imagePreview.value = postToEdit.value.picture_url
    }
    if (postToEdit.value.category) {
      postSelectedCategory.value = postToEdit.value.category
    }
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

    const categoryToSave =  postSelectedCategory.value ? getRouteOfCategory(postSelectedCategory.value) : ''

    await editStore.saveEditedPost(sanitizedContent, fileToUpload.value, categoryToSave)
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
  position: relative;

  .close-edition-modal-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
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
    @media (max-width: 768px) {
      padding: 1rem 0.5rem;
    }
  }
}
</style>