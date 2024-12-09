import { defineStore } from 'pinia'
import type { STORABLE_USER_NOTIFICATION } from '~/types/entities.types'
import { useUser, useClerk } from 'vue-clerk';



export const useNotificationsStore = defineStore({
  id: 'myNotificationsStore',
  state: () => ({ 
    notifications: [] as STORABLE_USER_NOTIFICATION[],
    hasUnreadNotifications: false,
    lastNotificationPageVisit: null as string | null,
  }),
  actions: {
    async fetchNotifications() {
      const toast = useToast()

      try {
        const response = await $fetch<STORABLE_USER_NOTIFICATION[]>('/api/user/notifications')
        
        if (Array.isArray(response)) {
          this.notifications = response
        }
      } catch (error) {
        toast.add({
          color: 'red', 
          icon: 'i-heroicons-x-mark',
          title: 'Error al cargar notificaciones',
          description: 'Intenta recargar la página'
        })
      }
    },
    async startNotificationsPolling(user: any) {
      const POLLING_INTERVAL = 60 * 60 * 1000 // 1 hour
      
      const poll = async () => {
        await this.fetchNotifications()
        setTimeout(poll, POLLING_INTERVAL)
        this.verifyUnreadNotifications(user)
      }

      await poll()
    },
    verifyUnreadNotifications(user: any) {
      if (!user || !this.notifications.length) return false
      
      if (!this.lastNotificationPageVisit) {
        this.lastNotificationPageVisit = user.unsafeMetadata.lastNotificationsPageVisit as string
      }

      if (!this.lastNotificationPageVisit) return true
      
      const lastVisitDate = new Date(this.lastNotificationPageVisit)
      
      this.hasUnreadNotifications = this.notifications.some(notification => {
        const notificationDate = new Date(notification.created_at)
        return notificationDate > lastVisitDate
      })
    }
  },
})
