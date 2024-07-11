<template>
  <div class="app-post">
    <div class="app-post__profile">
      <UAvatar src="/chicha-bot.png" size="xs" />
      <span><b>@chichabot</b> · Hace 1 hora</span>
    </div>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, explicabo pariatur minima doloribus illo dicta quam laborum quae, molestias cupiditate quod esse nihil veniam, inventore aliquam modi. Dignissimos, quis quibusdam!
    </p>
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