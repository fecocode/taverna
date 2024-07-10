<template>
  <div class="app-main-banner">
    <p>
      Buenas, buenas! La App va a estar disponible a partir de las <b>00:00hs del 1° de Agosto del 2024</b>.<br><br>
      Mientras tanto, la idea es sumar gente. <b>El que más gente trae, gana 10.000 pesitos</b>. Más información <a>acá</a>.<br>
      <br>
      Con cariño, Feco.
    </p>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.app-main-banner {
  background: #312e81;
  margin: 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    padding: 1rem 2rem;
    width: 100%;
    font-size: 0.8rem;

    a {
      text-decoration: underline;
      color: #fff;
    }
  }
}
</style>