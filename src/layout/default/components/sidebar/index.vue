<template>
  <aside class="sidebar h-full">
    <el-drawer
      v-model="showMenuDrawer"
      :size="drawerSize"
      :with-header="false"
      direction="ltr"
      title="主题设置"
    >
      <side />
    </el-drawer>
    <side v-show="!isMobile" />
  </aside>
</template>

<script lang="ts" setup>
import useAppStore from '@/stores/modules/app'
import useSettingStore from '@/stores/modules/setting'

import Side from './side.vue'

const appStore = useAppStore()
const settingStore = useSettingStore()

const isMobile = computed(() => appStore.isMobile)
const drawerSize = computed(() => {
    return `${settingStore.sideWidth + 1}px`
})

const showMenuDrawer = computed({
    get() {
        return !appStore.isCollapsed && isMobile.value
    },
    set(value) {
        appStore.toggleCollapsed(!value)
    }
})


</script>

<style lang="scss" scoped>
.sidebar {
    :deep(.el-drawer__body) {
        padding: 0;
    }
}
</style>
