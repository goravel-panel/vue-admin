<template>
  <div
    class="full-screen h-full cursor-pointer flex items-center px-2"
    @click="toggleFullscreen"
  >
    <icon
      :name="`local-icon-${isFullscreen ? 'fullscreen-exit' : 'fullscreen'}`"
      :size="16"
    />
  </div>
</template>

<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'

const { toggle: toggleFullscreen, isFullscreen } = useFullscreen()
</script>
