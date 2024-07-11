<template>
  <div class="app-post">
    <div class="app-post__profile">
      <UAvatar :src="authorAvatar" size="xs" />
      <span><b>@{{authorUsername}}</b> · Hace 1 hora</span>
    </div>
    <p v-html="text"></p>
    <UButtonGroup size="xs" orientation="horizontal" class="app-post__actions">
      <UButton color="gray" label="Pochoclear">
        <template #leading>
          <IconParkOutlinePopcorn />
        </template>
      </UButton>
      <!--<UButton color="gray" label="Comentar" disabled variant="soft">
        <template #leading>
          <IconamoonComment />
        </template>
      </UButton>-->
      <UButton color="gray" label="Compartir">
        <template #leading>
          <IconPhShareBold />
        </template>
      </UButton>
    </UButtonGroup>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  id: string,
  userId: string,
  text: string,
  authorAvatar: string,
  authorUsername: string,
  createdAt?: Date,
  updatedAt?: Date,
}>()
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
    padding: 1rem 0;
  }
}
</style>