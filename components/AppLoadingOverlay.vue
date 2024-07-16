<template>
  <div class="app-loading-overlay">
    <UAvatar src="/logo.png" size="3xl" />
    <div class="texts">
      <span class="brand"><strong>Chismecito</strong>.space</span>
      <span>Cargando...</span>
    </div>
    <IconSvgSpinners3DotsScale />
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.app-loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background: #222D;
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 4rem;
  z-index: 100;
  .texts {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    text-align: center;
    gap: 1rem;
    .brand {
      font-size: 1.5rem;
    }
  }
}
</style>