<template>
  <div class="app-users-post">
    <div class="app-users-post__profile">
      <UAvatar :src="userImage" size="xs" />
      <span><b>@{{userName}}</b> · Hace 1 hora</span>
    </div>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, explicabo pariatur minima doloribus illo dicta quam laborum quae, molestias cupiditate quod esse nihil veniam, inventore aliquam modi. Dignissimos, quis quibusdam!
    </p>
    <div class="app-users-post__actions">
      <UButton label="300" color="gray" variant="ghost" disabled>
        <template #leading>
          <IconParkOutlinePopcorn />
        </template>
      </UButton>
      <UButtonGroup size="xs" orientation="horizontal">
        <UButton color="gray" label="Compartir">
          <template #leading>
            <IconPhShareBold />
          </template>
        </UButton>
        <UButton color="red" icon="i-heroicons-trash" label="Eliminar" >
        </UButton>
      </UButtonGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSession } from 'vue-clerk'

const { session } = useSession()

const userImage = computed(() => session.value?.user.imageUrl || '')
const userName = computed(() => session.value?.user.username || '')


</script>

<style lang="scss" scoped>
.app-users-post {
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}
</style>