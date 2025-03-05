<template>
  <footer class="layout-footer">
    <div class="text-center p-2 text-xs text-tx-secondary max-w-[900px] mx-auto">
      <div
        v-if="copyright?.length > 0"
        class="copyright"
        v-html="copyright"
      />
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import useAppStore from '@/stores/modules/app'

const appStore = useAppStore()
const copyright = computed(() => appStore.config.copyright)
</script>

<style lang="scss" scoped>
.copyright {
    font-weight: 600;
    font-size: 14px;
    position: relative;
    width: 100%;
    padding: 20px 0 10px;
}
</style>
