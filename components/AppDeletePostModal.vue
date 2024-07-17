<template>
  <UAlert
    :actions="[
      { variant: 'solid', color: 'red', label: 'Si, eliminar', click: handleConfirmClick, loading: loading },
      { variant: 'link', color: 'gray', label: 'No, cancelar', click: handleCancelClick }
    ]"
    title="Estás eliminando tu chisme"
    description="¿Estás completamente seguro/a que querés eliminar este chisme?"
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