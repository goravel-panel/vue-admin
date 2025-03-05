<template>
  <div class="logo">
    <image-contain
      v-if="config.logo"
      :height="size"
      :src="config.logo"
      :width="size"
    />
    <transition name="title-width">
      <div
        v-show="showTitle"
        :class="{ 'text-white': theme === ThemeEnum.DARK }"
        :style="{ left: `${size + 16}px` }"
        class="logo-title overflow-hidden whitespace-nowrap"
      >
        <overflow-tooltip
          :content="title || config.name"
          :teleported="true"
          overflo-type="unset"
          placement="bottom"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ThemeEnum } from '@/enums/app'
import useAppStore from '@/stores/modules/app'

defineProps({
    size: { type: Number, default: 34 },
    title: { type: String, default: '' },
    theme: { type: String, default: '' },
    showTitle: { type: Boolean, default: true }
})

const appStore = useAppStore()
const config = computed(() => appStore.config)
</script>
<style lang="scss" scoped>
.logo {
    height: var(--navbar-height);
    overflow: hidden;
    @apply flex items-center p-2 relative;
    .logo-title {
        width: 70%;
        position: absolute;
        @apply text-xl;
    }

    .title-width-enter-active {
        opacity: 0;
        transition: all 0.3s ease-out;
    }

    .title-width-leave-active {
        transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .title-width-enter-from,
    .title-width-leave-to {
        width: 0;
        opacity: 0;
    }
}
</style>
