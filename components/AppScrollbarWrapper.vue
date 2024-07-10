<template>
  <component
    :is="containerComponent"
    :class="['app-scrollbar-container', themeClassName]"
    :style="{ ...trackCustomMargins }"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts" scoped>
import Simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

export default {
  name: 'AppScrollbarContainer',
  components: {
    Simplebar,
  },
  props: {
    theme: {
      type: String,
      default: 'default',
    },
    trackMarginBottom: {
      type: Number,
      default: 0,
    },
    trackMarginTop: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    themeClassName() {
      return `app-scrollbar-container--${this.theme}-theme`
    },
    containerComponent() {
      return 'simplebar'
    },
    trackCustomMargins() {
      return {
        '--track-margin-top': `${this.trackMarginTop}px`,
        '--track-margin-bottom': `${this.trackMarginBottom}px`,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.app-scrollbar-container {
  --track-margin-top: 0;
  --track-margin-bottom: 0px;

  ::v-deep {
    .simplebar-track.simplebar-vertical {
      padding: 0;
      margin-top: calc(4px + var(--track-margin-top));
      margin-right: 0;
      margin-bottom: calc(4px + var(--track-margin-bottom));
      margin-left: 0;

      width: 12px;
      transition: opacity 200ms ease-out;
    }
    .simplebar-scrollbar::before {
      background-color: var(--light-gray);
      opacity: 1 !important;
      width: 4px;
      border-radius: 4px;

      left: 4px;
    }
  }
}
</style>
