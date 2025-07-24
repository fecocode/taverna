<template>
  <AppScrollbarWrapper class="scroll-bar">
    <h3 class="flex space-x-3 items-center border-b border-zinc-700">
      <UIcon name="i-heroicons-bell-solid" class="text-yellow-400" />
      <span>Notificaciones</span>
    </h3>
    <AppNotification
      v-for="notification in notifications"
      :image="notification.image_url"
      :link="notification.link"
      :text="notification.text"
      :timestamp="notification.created_at"
    />
  </AppScrollbarWrapper>
</template>

<script lang="ts" setup>
import { useUser } from 'vue-clerk';

const router = useRouter()

const notificationsStore = useNotificationsStore()

const notifications = computed(() => notificationsStore.notifications)

onMounted(async () => {
  const { user } = useUser()
  if (user.value) {
    await notificationsStore.fetchNotifications()

    if (user.value) {
      const timestamp = new Date()
      await user.value.update({
        unsafeMetadata: {
          lastNotificationsPageVisit: timestamp
        }
      })
      notificationsStore.lastNotificationPageVisit = `${timestamp}`
      notificationsStore.hasUnreadNotifications = false
    }
  } else {
    router.push({ name: 'index' })
  }
})
</script>

<style lang="scss" scoped>
.scroll-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #777;
  padding: 1.5rem;
}
</style>