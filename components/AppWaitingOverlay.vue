<template>
  <div class="app-loading-overlay">
    <UAvatar src="/logo.png" size="3xl" />
    <div class="texts">
      <span class="brand"><strong>Chismecito</strong>.space</span>
      <span>Lanzamiento: Miércoles 17 de Julio del 2024</span>
    </div>
    <UButton label="¿Un regalito de bienvenida?" color="indigo" icon="i-heroicons-gift" size="xl" @click="modalsStore.openRickRollModal()" />
  </div>
</template>

<script lang="ts" setup>
const modalsStore = useModalsStore()
</script>

<style lang="scss" scoped>
.app-loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background: #0b0a1dAA;
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 5rem;
  z-index: 10;
  .texts {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    text-align: center;
    gap: 1rem;
    max-width: 90%;
    @media (max-width: 768px) {
      font-size: 0.85rem;
    }
    .brand {
      font-size: 3rem;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }
  }
}
</style>