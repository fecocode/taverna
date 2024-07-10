<script lang="ts" setup>
import { UserButton } from 'vue-clerk'
</script>

<template>
  <div class="app-footer">
    <span>
      Desarrollado por <a href="https://fecocode.com" target="_blank">Feco</a>
    </span>
    <span>
      <a>Políticas de privacidad</a> · <a>Términos y condiciones</a> · <a>Ayuda</a> · <a>Botón de arrepentimiento</a>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.app-footer {
  display: flex;
  padding: 1rem 1.5rem;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #333;
  text-align: center;
  background-color: #242429;
  z-index: 10;
  flex-direction: column;
  gap: 0.5rem;
  span {
    font-size: 0.8rem;
    text-wrap: wrap;
    a {
      color: #fff;
      font-weight: 600;
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}
</style>