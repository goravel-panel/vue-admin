<template>
  <main class="main-wrap h-full bg-page">
    <el-scrollbar>
      <div class="p-4">
        <router-view
          v-if="isRouteShow"
          v-slot="{ Component, route }"
        >
          <keep-alive
            :include="includeList"
            :max="20"
          >
            <el-watermark
              v-if="defaultSetting.showWatermark"
              :content="watermark"
              :font="font"
            >
              <component
                :is="Component"
                :key="route.fullPath"
              />
            </el-watermark>
            <component
              :is="Component"
              v-else
              :key="route.fullPath"
            />
          </keep-alive>
        </router-view>
      </div>
    </el-scrollbar>
  </main>
</template>

<script lang="ts" setup>
import config from '@/config'
import defaultSetting from '@/config/setting'
import useAppStore from '@/stores/modules/app'
import useTabsStore from '@/stores/modules/multipleTabs'
import useSettingStore from '@/stores/modules/setting'

const appStore = useAppStore()
const tabsStore = useTabsStore()
const settingStore = useSettingStore()
const isRouteShow = computed(() => appStore.isRouteShow)
const includeList = computed(() => (settingStore.openMultipleTabs ? tabsStore.getCacheTabList : []))

const font = reactive({
    color: 'rgba(0, 0, 0, .15)'
})

const watermark = computed(() => {
    return `${config.name}`
})
</script>
