<template>
  <div
    class="refresh cursor-pointer h-full flex items-center px-2"
    @click="refreshView"
  >
    <icon
      :size="18"
      name="el-icon-RefreshRight"
    />
  </div>
</template>

<script lang="ts" setup>
import useAppStore from '@/stores/modules/app'

const appStore = useAppStore()
// 刷新页面
const refreshView = () => {
    appStore.refreshView()
}
</script>
