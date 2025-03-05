<template>
  <header class="header">
    <div class="navbar">
      <div class="flex-1 flex">
        <div class="navbar-item">
          <fold />
        </div>
        <div class="navbar-item">
          <refresh />
        </div>
        <div
          v-if="!isMobile && settingStore.showCrumb"
          class="flex items-center px-2"
        >
          <breadcrumb />
        </div>
      </div>
      <div class="flex">
        <div
          v-if="!isMobile"
          class="navbar-item"
        >
          <full-screen />
        </div>
        <div class="navbar-item">
          <user-drop-down />
        </div>
        <div class="navbar-item">
          <setting />
        </div>
      </div>
    </div>
    <multiple-tabs v-if="settingStore.openMultipleTabs" />
  </header>
</template>

<script lang="ts" setup>
import useAppStore from '@/stores/modules/app'
import useSettingStore from '@/stores/modules/setting'

import Setting from '../setting/index.vue'
import Breadcrumb from './breadcrumb.vue'
import Fold from './fold.vue'
import FullScreen from './full-screen.vue'
import MultipleTabs from './multiple-tabs.vue'
import Refresh from './refresh.vue'
import UserDropDown from './user-drop-down.vue'

const appStore = useAppStore()
const isMobile = computed(() => appStore.isMobile)
const settingStore = useSettingStore()
</script>

<style lang="scss">
.navbar {
    height: var(--navbar-height);
    @apply flex px-2 bg-body;
    .navbar-item {
        @apply h-full  flex justify-center items-center  hover:bg-page;
    }
}
</style>
