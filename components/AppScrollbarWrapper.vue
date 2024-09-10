<template>
  <component
    :is="containerComponent"
    :class="['app-scrollbar-container', themeClassName]"
    :style="{ ...trackCustomMargins }"
  >
    <slot></slot>
  </component>
</template>

<script scoped>
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
  data() {
    return {
      scrollXPosition: 0,
    }
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

  :deep {
    .simplebar-track {
      display: none;
    }
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
      background-color: #333;
      opacity: 0 !important;
      width: 4px;
      border-radius: 4px;

      left: 4px;
    }
  }
}
</style>
