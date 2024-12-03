<template>
  <UAlert
    :actions="[
      { variant: 'solid', color: 'red', label: 'Sí, borrar', click: handleConfirmClick, loading: loading },
      { variant: 'link', color: 'gray', label: 'No, cancelar', click: handleCancelClick }
    ]"
    title="Estás eliminando tu post"
    description="¿Querés continuar?"
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