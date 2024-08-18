<template>
  <UAlert
    :actions="[
      { variant: 'solid', color: 'red', label: 'Yes, delete', click: handleConfirmClick, loading: loading },
      { variant: 'link', color: 'gray', label: 'No, cancel', click: handleCancelClick }
    ]"
    title="You are deleting your post"
    description="Are you sure?"
  />
</template>

<script lang="ts" setup>
const modalsStore = useModalsStore()
const editStore = useEditStore()

const loading = computed(() => editStore.deleting)

function handleConfirmClick() {
  editStore.deletePost()
}
async function handleCancelClick() {
  await editStore.resetPostToDelete()
  modalsStore.closeDeletePostModal()
}
</script>