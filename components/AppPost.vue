<template>
  <div class="app-post" :class="{ 'highlighted': isHighlighted }" @click="handleGoToPostPage">
    <div class="app-post__ellipsis" v-if="!readonly">
      <UPopover :popper="{ placement: 'left-start' }">
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
              label="Editar chisme"
              @click="handleEditPostClick(close)"
            />
            <UButton
              v-if="isCurrentUserPostOwner"
              icon="i-heroicons-trash"
              size="2xs"
              color="red"
              variant="link"
              label="Eliminar chisme"
              @click="handleDeletePostClick(close)"
            />
            <UButton
              v-if="!isCurrentUserPostOwner"
              icon="i-heroicons-megaphone"
              size="2xs"
              color="gray"
              variant="link"
              label="Reportar"
              @click="modalsStore.openReportModal()"
            />
          </div>
        </template>
      </UPopover>
    </div>
    <div class="app-post__profile">
      <UAvatar :src="authorAvatar" size="xs" />
      <span>
        <b>@{{authorUsername}} <small v-if="isCurrentUserPostOwner" class="text-indigo-300">(vos)</small></b>
        <span v-show="timeAgo"> · {{ timeAgo }}</span>
      </span>
    </div>
    <p v-html="sanitizedContent" class="app-post__content"></p>
    <div class="app-post__fav-count-display">
      <span v-if="updatedAt">Editado · </span>
      <IconParkOutlinePopcorn />
      <span>{{ favCountText }}</span>
    </div>
    <div v-if="!readonly" class="app-post__actions">
      <UTooltip :popper="{ placement: 'bottom' }" :text="favButtonLabel">
        <UButton :color="favButtonColor" :label="abbreviateFavCount" :variant="isInUserFavList ? 'solid' : 'ghost'" :loading="favLoading" @click.stop="handleFavClick" :ui="{ rounded: 'rounded-full' }" size="md">
          <template #leading>
            <IconSvgSpinners3DotsScale v-if="favLoading" />
            <IconParkOutlinePopcorn v-else />
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
</template>

<script lang="ts" setup>
import moment from 'moment'
import { useAuth } from 'vue-clerk'
import type { IPost } from '@/types/post.interface'
import DOMPurify from 'dompurify'

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
}>()

const timeAgo = ref('')
const timeAgoRefreshInterval = ref()
const favLoading = ref(false)

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
  } else if (days < 30) {
      return `${Math.floor(days)} ${Math.floor(days) === 1 ? 'día' : 'días'}`;
  } else if (months < 12) {
      return `${Math.floor(months)} ${Math.floor(months) === 1 ? 'mes' : 'meses'}`;
  } else {
      return `${Math.floor(years)} ${Math.floor(years) === 1 ? 'año' : 'años'}`;
  }
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

const shareUrl = computed(() => `${window.location.host}/?shared=${props.id}`)

const isCurrentUserPostOwner = computed(() => {
  return props.userId === auth.userId.value
})

const repliesCount = computed(() => {
  return abbreviateNumber(props.post.replies_count)
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

const isHighlighted = computed(() => {
  const { shared } = route.query

  if (shared) {
    return props.id === `${shared}`
  }

  return false
})

const abbreviateFavCount = computed(() => {
  return abbreviateNumber(props.favCount)
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
    return 'Despochoclear'
  } else {
    return 'Pochoclear'
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
      return `Pochocleado ${props.favCount} veces`
    } else {
      return `Pochocleado ${props.favCount} vez`
    }
  } else {
    return 'Sin pochocleadas'
  }
})

const favButtonColor = computed(() => {
  if (isInUserFavList.value) {
    return 'indigo'
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

function handleGoToPostPage() {
  if (props.readonly) {
    return
  }

  router.push({
    name: 'p-id',
    params: {
      id: props.id
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
        title: 'Se copió la URL al portapapeles',
      })
    })
    .catch((err) => {
      toast.add({
        color: 'red',
        icon: 'i-heroicons-x-mark',
        title: 'No se pudo copiar la url del chisme',
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
    } else {
      await favsStore.setAsFavPost(props.id)
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

  &__content {
    font-size: 0.9rem;
  }

  &:hover {
    cursor: pointer;
    background: #cccccc05;
  }

  &.highlighted {
    background: #1e1b4b55;
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

  @media (max-width: 768px) {
    padding: 1rem;
  }

  &:last-of-type {
    border-bottom: none;
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