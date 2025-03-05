<template>
  <div class="footer-button">
    <div
      :style="fixed ? 'position: fixed' : ''"
      class="footer-button__content"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
    fixed: {
        type: Boolean,
        default: true
    }
})
</script>

<style lang="scss" scoped>
.footer-button {
    height: 60px;

    &__content {
        bottom: 0;
        height: 60px;
        right: 0;
        left: 0;
        z-index: 99;
        @apply flex justify-center items-center shadow bg-body;
    }
}
</style>
