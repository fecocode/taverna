import { defineStore } from 'pinia'
import type { UITrigger } from '~/types/internal/trigger.types'

export const useTriggerStore = defineStore({
  id: 'triggerStore',
  state: () => ({
    triggers: [] as UITrigger[],
  }),
  actions: {
    addNewTrigger(trigger: UITrigger) {
      this.triggers.push(trigger)
    }
  }
})
