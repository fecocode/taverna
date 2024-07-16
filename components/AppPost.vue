<template>
  <div class="app-post">
    <div class="app-post__profile">
      <UAvatar :src="authorAvatar" size="xs" />
      <span><b>@{{authorUsername}}</b> <span v-show="timeAgo">· {{ timeAgo }}</span></span>
    </div>
    <p v-html="text"></p>
    <div class="app-post__fav-count-display">
      <IconParkOutlinePopcorn />
      <span>{{ favCountText }}</span>
    </div>
    <UButtonGroup size="xs" orientation="horizontal" class="app-post__actions">
      <UButton :color="favButtonColor" :label="favButtonLabel" :loading="favLoading" @click="handleFavClick">
        <template #leading>
          <IconSvgSpinners3DotsScale v-if="favLoading" />
          <IconParkOutlinePopcorn v-else />
        </template>
      </UButton>
      <!--<UButton color="gray" label="Comentar" disabled variant="soft">
        <template #leading>
          <IconamoonComment />
        </template>
      </UButton>-->
      <UButton v-if="showShareButton" color="gray" label="Compartir" @click="handleShareClick">
        <template #leading>
          <IconPhShareBold />
        </template>
      </UButton>
    </UButtonGroup>
  </div>
</template>

<script lang="ts" setup>
import moment from 'moment'
import { useAuth } from 'vue-clerk'

const toast = useToast()
const favsStore = useFavsStore()
const modalsStore = useModalsStore()
const auth = useAuth()

const props = defineProps<{
  id: string,
  userId: string,
  text: string,
  authorAvatar: string,
  authorUsername: string,
  favCount: number,
  createdAt?: Date,
  updatedAt?: Date,
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

const favButtonLabel = computed(() => {
  if (favLoading.value) {
    return ''
  } else if (isInUserFavList.value) {
    return 'Quitar de mis pochoclos'
  } else {
    return 'Pochoclear'
  }
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

function handleShareClick() {
  if (navigatorCanShare.value) {
    navigator.share({ url: shareUrl.value })
  } else {
    copyUrlToClipboard()
  }
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
</script>

<style lang="scss" scoped>
.app-post {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid #333;
  padding: 1rem 1.5rem;
  gap: 1rem;

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
    padding-bottom: 1rem 0;
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