<template>
  <div class="app-post" :class="{ 'highlighted': isHighlighted }" @click="handleGoToPostPage">
    <div v-if="enableThreadIndicator" class="app-post__thread-indicator">
      <div class="circle"></div>
    </div>
    <div class="app-post__ellipsis" v-if="showControls">
      <UPopover :popper="{ placement: 'left-start' }" @click.stop>
        <UButton
          icon="i-heroicons-ellipsis-vertical"
          size="2xs"
          :ui="{ rounded: 'rounded-full' }"
          color="gray"
          variant="ghost"
        />
        <template #panel="{ close }">
          <div class="ellipsis-menu">
            <UButton
              v-if="isCurrentUserPostOwner"
              icon="i-heroicons-pencil"
              size="2xs"
              color="gray"
              variant="link"
              label="Editar"
              @click.stop="handleEditPostClick(close)"
            />
            <UButton
              v-if="isCurrentUserPostOwner"
              icon="i-heroicons-trash"
              size="2xs"
              color="red"
              variant="link"
              label="Eliminar"
              @click.stop="handleDeletePostClick(close)"
            />
            <UButton
              v-if="!isCurrentUserPostOwner"
              icon="i-heroicons-megaphone"
              size="2xs"
              color="gray"
              variant="link"
              label="Reportar"
              @click.stop="modalsStore.openReportModal()"
            />
          </div>
        </template>
      </UPopover>
    </div>
    <div v-if="showParentPost" class="flex items-center space-x-2 text-xs py-1" @click.stop>
      <IconamoonComment class="text-sky-400" /> 
      <span>Respondiendo a <NuxtLink :to="{ name: 'p-id', params: { id: parentPostId } }" class="text-blue-400">Este post</NuxtLink></span>
    </div>
    <div v-if="postCategory" class="flex items-center space-x-2 text-xs py-1" @click.stop>
      <UBadge color="sky" variant="soft" size="xs">
        <div class="flex items-center space-x-1 opacity-90">
          <UIcon name="i-heroicons-hashtag-16-solid" />
          <span>{{ postCategory }}</span>
        </div>
      </UBadge>
    </div>
    <div class="app-post__profile" @click.stop="goToAuthorProfile">
      <UAvatar :src="authorAvatar" size="xs" />
      <span>
        <b>@{{authorUsername}} <small v-if="isCurrentUserPostOwner" class="text-zinc-400">(you)</small></b>
        <span v-show="timeAgo"> · {{ timeAgo }}</span>
      </span>
    </div>
    <p v-if="post.deleted" class="text-stone-400"><i>This post has been deleted.</i></p>
    <p v-else v-html="sanitizedContent" class="app-post__content"></p>
    <div
      class="app-post__image-preview"
      v-if="pictureUrl && !readonly"
      ref="previewImageElement"
      :style="maxPreviewImageHeightStyle"
      @click.stop="showImageViewerModal = true"
    >
      <USkeleton v-if="!imageLoaded" class="absolute inset-0" :ui="{ background: 'bg-zinc-100 dark:bg-zinc-900' }" />
      <img :class="{ invisible: !imageLoaded }" :src="pictureUrl" :onload="handlePreviewLoad" />
    </div>
    <div class="app-post__fav-count-display" v-if="updatedAt">
      <span>Editado</span>
    </div>
    <div v-if="showControls" class="app-post__actions">
      <UTooltip :popper="{ placement: 'bottom' }" :text="favButtonLabel">
        <UButton :color="favButtonColor" :label="abbreviateFavCount" :variant="isInUserFavList ? 'ghost' : 'ghost'" :loading="favLoading" @click.stop="handleFavClick" :ui="{ rounded: 'rounded-full' }" size="md">
          <template #leading>
            <IconSvgSpinners3DotsScale v-if="favLoading" />
            <UIcon v-else-if="isInUserFavList" name="i-heroicons-heart-20-solid" />
            <UIcon v-else name="i-heroicons-heart" />
          </template>
        </UButton>
      </UTooltip>
      <UTooltip :popper="{ placement: 'bottom' }" text="Responder">
        <UButton color="gray" :label="repliesCount" variant="ghost" :loading="favLoading" @click.stop="handleReplyClick" :ui="{ rounded: 'rounded-full' }" size="md">
          <template #leading>
            <IconamoonComment />
          </template>
        </UButton>
      </UTooltip>
      <UTooltip :popper="{ placement: 'bottom' }" :text="shareButtonText">
        <UButton v-if="showShareButton" color="gray" variant="ghost" @click.stop="handleShareClick" :ui="{ rounded: 'rounded-full' }" size="md">
          <template #leading>
            <IconPhShareBold v-if="navigatorCanShare" />
            <IconHeroiconsLink v-else />
          </template>
        </UButton>
      </UTooltip>
    </div>
  </div>
  <UModal
    v-if="post.picture_url" v-model="showImageViewerModal"
    :ui="{ background: 'bg-transparent dark:bg-transparent', container: 'flex min-h-full items-center justify-center text-center', width: 'w-full sm:max-w-screen-lg' }"
  >
    <AppPostImageViewer :image-src="post.picture_url" @close="showImageViewerModal = false" />
  </UModal>
</template>

<script lang="ts" setup>
import moment from 'moment'
import { useAuth } from 'vue-clerk'
import type { IPost } from '@/types/post.interface'
import DOMPurify from 'dompurify'
import { getCategoryOfRoute } from '~/constants/supported-post-categories.constants';

const toast = useToast()
const favsStore = useFavsStore()
const modalsStore = useModalsStore()
const auth = useAuth()
const editStore = useEditStore()
const route = useRoute()
const router = useRouter()
const replyStore = useReplyStore()

const props = defineProps<{
  id: string,
  userId: string,
  text: string,
  authorAvatar: string,
  authorUsername: string,
  favCount: number,
  createdAt?: Date,
  updatedAt?: Date,
  post: IPost,
  readonly?: boolean,
  isHighlighted?: boolean,
  enableShowParentPost?: boolean,
  enableThreadIndicator?: boolean,
}>()

const timeAgo = ref('')
const timeAgoRefreshInterval = ref()
const favLoading = ref(false)
const maxPreviewImageHeight = ref()
const previewImageElement = ref()
const imageLoaded = ref(false)
const showImageViewerModal = ref(false)

function getTimeAgo(date: Date) {
  const now = moment();
  const duration = moment.duration(now.diff(date));
  const seconds = duration.asSeconds();
  const minutes = duration.asMinutes();
  const hours = duration.asHours();
  const days = duration.asDays();
  const months = duration.asMonths();
  const years = duration.asYears();

  if (seconds < 60) {
    return 'Ahora';
  } else if (minutes < 60) {
      return `${Math.floor(minutes)} ${Math.floor(minutes) === 1 ? 'minuto' : 'minutos'}`;
  } else if (hours < 24) {
      return `${Math.floor(hours)} ${Math.floor(hours) === 1 ? 'hora' : 'horas'}`;
  } else if (days < 60) {
      return `${Math.floor(days)} ${Math.floor(days) === 1 ? 'dia' : 'dias'}`;
  } else if (months < 24) {
      return `${Math.floor(months)} ${Math.floor(months) === 1 ? 'mes' : 'meses'}`;
  } else {
      return `${Math.floor(years)} ${Math.floor(years) === 1 ? 'año' : 'años'}`;
  }
}

const maxPreviewImageHeightStyle = computed(() => {
  return `--preview-image-max-height: ${maxPreviewImageHeight.value}px;`
})

function handlePreviewLoad() {
  imageLoaded.value = true

  const {width} = previewImageElement?.value?.getBoundingClientRect() || 0

  maxPreviewImageHeight.value = 16 * width / 9
}

onMounted(() => {
  if (props.createdAt) {
    timeAgo.value = getTimeAgo(props.createdAt)
    timeAgoRefreshInterval.value = setInterval(() => {
      if (props.createdAt) {
        timeAgo.value = getTimeAgo(props.createdAt)
      } else {
        timeAgo.value = ''
      }
    }, 60000);
  }
})

onUnmounted(() => {
  if (timeAgoRefreshInterval.value) {
    clearInterval(timeAgoRefreshInterval.value)
  }
})

const shareUrl = computed(() => `${window.location.host}/p/${props.id}`)

const isCurrentUserPostOwner = computed(() => {
  return props.userId === auth.userId.value
})

const repliesCount = computed(() => {
  return abbreviateNumber(props.post.replies ? props.post.replies.length : props.post.replies_count)
})

const pictureUrl = computed(() => {
  return props.post.picture_url
})

const navigatorHasClipboard = computed(() => {
  return !!navigator.clipboard
})

const navigatorCanShare = computed(() => {
  return !!navigator.canShare && navigator.canShare({ url: shareUrl.value })
})

const showShareButton = computed(() => {
  return navigatorHasClipboard.value || navigatorCanShare.value
})

const isInUserFavList = computed(() => {
  return favsStore.parsedUserFavsPostsIds.includes(props.id)
})

const abbreviateFavCount = computed(() => {
  return abbreviateNumber(props.favCount)
})

const postCategory = computed(() => {

  const categoryRoute = props.post.category
  if (categoryRoute) {
    return getCategoryOfRoute(categoryRoute) || ''
  }

  return ''
})


const showControls = computed(() => {
  return !props.readonly && !props.post.deleted
})

function abbreviateNumber(value:number) {
  if (value >= 1e6) {
    return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (value >= 1e3) {
    return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return value?.toString() || '';
}

const favButtonLabel = computed(() => {
  if (favLoading.value) {
    return ''
  } else if (isInUserFavList.value) {
    return 'Ya no me gusta'
  } else {
    return 'Me gusta'
  }
})

const sanitizedContent = computed(() => {
  return DOMPurify.sanitize(props.text, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
})

const favCountText = computed(() => {

  if (props.favCount) {
    if (props.favCount > 1) {
      return `Saved ${props.favCount} times`
    } else {
      return `Saved ${props.favCount} time`
    }
  }
})

const favButtonColor = computed(() => {
  if (isInUserFavList.value) {
    return 'sky'
  } else {
    return 'gray'
  }
})

const shareButtonText = computed(() => {
  if (navigatorCanShare.value) {
    return 'Compartir'
  } else {
    return 'Copiar link'
  }
})

const parentPostId = computed(() => {
  return props.post.parent_post_id
})

const showParentPost = computed(() => {
  return props.enableShowParentPost && !!parentPostId.value
})

function handleGoToPostPage(e: any) {
  if (props.readonly) {
    return
  }

  if (e.target.tagName.toLowerCase() === 'a')  {
    return
  }

  const textSelected = window.getSelection()?.toString()

  if (textSelected && textSelected.length > 0) {
    return
  }

  router.push({
    name: 'p-id',
    params: {
      id: props.id
    }
  })
}

function goToAuthorProfile() {
  const authorUsername = props.post.author.username

  router.push({
    name: 'a-username',
    params: {
      username: authorUsername
    }
  })
}

function handleShareClick() {
  if (navigatorCanShare.value) {
    navigator.share({ url: shareUrl.value })
  } else {
    copyUrlToClipboard()
  }
}

function handleReplyClick() {
  replyStore.setPostToReply(props.post)
}

function copyUrlToClipboard() {
  navigator.clipboard
    .writeText(shareUrl.value)
    .then(() => {
      toast.add({
        color: 'green',
        icon: 'i-heroicons-check',
        title: 'Se copió la URL',
      })
    })
    .catch((err) => {
      toast.add({
        color: 'red',
        icon: 'i-heroicons-x-mark',
        title: `No se pudo copiar la URL`,
        description: 'Intentalo nuevamente en unos minutos'
      })
    })
}

async function handleFavClick() {
  if (!auth.isSignedIn.value) {
    modalsStore.openSignUpModal()
    return
  }
  try {
    favLoading.value = true
    if (isInUserFavList.value) {
      await favsStore.unfavPost(props.id)
      props.post.fav_count--
    } else {
      await favsStore.setAsFavPost(props.id)
      props.post.fav_count++
    }
  } catch (_) {
    toast.add({
      color: 'red',
      icon: 'i-heroicons-x-mark',
      title: 'Ocurrió un error',
      description: 'Intentalo nuevamente en unos minutos'
    })
  } finally {
    favLoading.value = false
  }
}

function handleDeletePostClick(closePopoverFunction: Function) {
  closePopoverFunction()
  editStore.setPostToDelete(props.post)
}
function handleEditPostClick(closePopoverFunction: Function) {
  closePopoverFunction()
  editStore.setPostToEdit(props.post)
}
</script>

<style lang="scss" scoped>
.app-post {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid #333;
  padding: 1rem 2rem;
  gap: 1rem;
  position: relative;

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
  }

  &:first-of-type {
    border-top: none;
  }

  &__content {
    font-size: 0.9rem;
    max-width: 100%;

    &::v-deep a {
      font-weight: 600;
      color: #bfdbfe;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }

    &::v-deep * {
      text-wrap: wrap;
      max-width: 100%;
      word-wrap: break-word;
    }
  }

  &:hover {
    cursor: pointer;
    background: #24242922;
  }

  &.highlighted {
    background: #242429;
  }

  &__ellipsis {
    position: absolute;
    top: 1rem;
    right: 1rem;
    .ellipsis-menu {
      display: flex;
      padding: 0.5rem;
      gap: 0.5rem;
      flex-direction: column;
      align-items: flex-start;
      width: fit-content;
    }
  }

  &__thread-indicator {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    position: absolute;
    left: 0.75rem;
    top: -1px;
    height: calc(100% + 1px);
    background: #eee2;
    padding-top: 1.5rem;
    width: 2px;

    @media (max-width: 768px) {
      display: none;
    }

    .circle {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 0.5rem;
      background: #eee;
      position: absolute;
    }
  }

  &:first-of-type {
    .app-post__thread-indicator {
      top: 1.5rem;
      height: calc(100% - 1.5rem);
      padding-top: 0;
    }
  }

  &:last-of-type {
    .app-post__thread-indicator {
      top: -1px;
      height: calc(1.5rem + 1px);
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
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
    padding: 0.5rem 0;
    display: flex;
    gap: 1rem;
    align-items: center;
    width: 100%;
  }
  &__fav-count-display {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    margin-top: 1rem;
    color: #aaa;
  }
}
</style>