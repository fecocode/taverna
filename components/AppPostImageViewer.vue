<template>
  <UButton
    size="lg"
    :ui="{ rounded: 'rounded-full' }"
    label="Close"
    color="gray"
    variant="soft"
    icon="i-heroicons-x-mark-solid"
    class="close-button"
    @click="$emit('close')"
  />
  <div ref="container" class="image-container">
    <img :src="imageSrc" :class="imageClass" />
  </div>
</template>

<script lang="ts" setup>

defineEmits(['close'])

interface Props {
  imageSrc: string;
}

const props = defineProps<Props>()

const container = ref<HTMLElement | null>(null)
const imageClass = ref<string>('')

onMounted(() => {
  if (container.value) {
    const containerWidth = container.value.clientWidth
    const maxContainerHeight = window.innerHeight * 0.8

    const img = new Image()
    img.src = props.imageSrc
    img.onload = () => {
      const imageRatio = img.width / img.height
      const containerRatio = containerWidth / maxContainerHeight

      if (imageRatio > containerRatio) {
        imageClass.value = 'fill-width'
      } else {
        imageClass.value = 'fill-height'
      }
    }
  }
})
</script>

<style scoped lang="scss">
.close-button {
  position: fixed;
  top: 1rem;
  right: 1rem;
}
.image-container {
  width: 100%;
  max-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.fill-width {
  width: 100%;
  height: auto;
}

.fill-height {
  width: auto;
  height: 80vh;
}
</style>