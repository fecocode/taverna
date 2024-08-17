<script lang="ts" setup>
import { useModalsStore } from '~/stores/modals';

const modalStore = useModalsStore()
</script>

<template>
  <div class="app-footer">
    <span>
      <a @click="modalStore.openPrivacyPolicyModal()">Privacy policy</a> · <a @click="modalStore.openTermsAndConditionsModal()">Terms and conditions</a> · <a @click="modalStore.openRulesModal()">Code of conduct</a>
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