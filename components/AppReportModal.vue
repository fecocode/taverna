<template>
  <UCard>
    <template #header>
      <div class="app-report-modal__header">
        <span>Report post</span>
        <UButton
          size="xs"
          :ui="{ rounded: 'rounded-full' }"
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-solid"
          @click="$emit('close')"
        >
        </UButton>
      </div>
    </template>
    <div class="app-report-modal space-y-5">
      <p>
        Please select the reason for your report:
      </p>
      <USelect
        :options="reasonsArray"
        v-model="reason"
        placeholder="Reason for your report"
      />
      <UInput
        v-if="reason === 'Other'"
        placeholder="Other reason"
        v-model="otherReason"
      />
      <div class="flex justify-end">
        <UButton
          label="Send report"
          color="black"
          icon="i-heroicons-paper-airplane"
        />
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const modalsStore = useModalsStore()

const reason = ref()
const otherReason = ref('')

defineEmits(['close'])

const reasonsArray = ['Spam',
  'Inappropriate content',
  'Harassment or bullying',
  'False information',
  'Other'
]


</script>

<style lang="scss" scoped>
.app-report-modal {
  font-size: 0.85rem;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>