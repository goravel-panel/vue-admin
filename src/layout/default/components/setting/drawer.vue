<template>
  <div class="setting-drawer">
    <el-drawer
      v-model="showSetting"
      append-to-body
      direction="rtl"
      size="250px"
      title="主题设置"
    >
      <div class="setting-item mb-5">
        <span class="text-tx-secondary">风格设置</span>
        <div class="flex mt-4 cursor-pointer">
          <div
            v-for="item in sideThemeList"
            :key="item.type"
            class="mr-4 flex relative text-primary"
            @click="sideTheme = item.type"
          >
            <img
              v-if="item.image"
              :src="item.image"
              height="36"
              width="52"
            >
            <icon
              v-if="sideTheme === item.type"
              class="icon-select"
              name="el-icon-Select"
            />
          </div>
        </div>
      </div>
      <div class="setting-item mb-5 flex justify-between items-center">
        <span class="text-tx-secondary">主题颜色</span>
        <div>
          <el-color-picker
            v-model="theme"
            :predefine="predefineColors"
          />
        </div>
      </div>
      <div class="setting-item mb-5 flex justify-between items-center">
        <span class="text-tx-secondary">开启黑暗模式</span>
        <div>
          <el-switch
            :model-value="isDark"
            @change="toggleDark"
          />
        </div>
      </div>
      <div class="setting-item mb-5 flex justify-between items-center">
        <span class="text-tx-secondary">开启多页签栏</span>
        <div>
          <el-switch
            v-model="openMultipleTabs"
            :active-value="true"
            :inactive-value="false"
          />
        </div>
      </div>
      <div class="setting-item mb-5 flex justify-between items-center">
        <span class="text-tx-secondary">只展开一个菜单</span>
        <div>
          <el-switch
            v-model="isUniqueOpened"
            :active-value="true"
            :inactive-value="false"
          />
        </div>
      </div>
      <div class="setting-item mb-5 flex justify-between items-center">
        <div class="text-tx-secondary flex-none mr-3">
          菜单栏宽度
        </div>
        <div>
          <el-input-number
            v-model="sideWidth"
            :max="250"
            :min="150"
          />
        </div>
      </div>
      <div class="setting-item mb-5 flex justify-between items-center">
        <div class="text-tx-secondary flex-none mr-3">
          显示LOGO
        </div>
        <div>
          <el-switch
            v-model="showLogo"
            :active-value="true"
            :inactive-value="false"
          />
        </div>
      </div>
      <div class="setting-item mb-5 flex justify-between items-center">
        <div class="text-tx-secondary flex-none mr-3">
          显示面包屑
        </div>
        <div>
          <el-switch
            v-model="showCrumb"
            :active-value="true"
            :inactive-value="false"
          />
        </div>
      </div>
      <div class="setting-item mb-5 flex justify-between items-center">
        <el-button @click="resetTheme">
          重置主题
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

import theme_dark from '@/assets/images/theme_black.png'
import theme_light from '@/assets/images/theme_white.png'
import { ThemeEnum } from '@/enums/app.ts'
import useSettingStore from '@/stores/modules/setting'

const settingStore = useSettingStore()
const predefineColors = ref([
    '#4A5DFF',
    '#409EFF',
    '#28C76F',
    '#52c41a',
    '#EA5455',
    '#eb2f96',
    '#FF9F43',
    '#13c2c2',
    '#01CFE8',
    '#722ed1'
])
const sideThemeList = [
    {
        type: ThemeEnum.DARK,
        image: theme_dark
    },
    {
        type: ThemeEnum.LIGHT,
        image: theme_light
    }
]

const sideTheme = computed({
    get() {
        return settingStore.sideTheme
    },
    set(value) {
        settingStore.setSetting({
            key: 'sideTheme',
            value
        })
    }
})

const openMultipleTabs = computed({
    get() {
        return settingStore.openMultipleTabs
    },
    set(value) {
        settingStore.setSetting({
            key: 'openMultipleTabs',
            value
        })
    }
})

const isUniqueOpened = computed({
    get() {
        return settingStore.isUniqueOpened
    },
    set(value) {
        settingStore.setSetting({
            key: 'isUniqueOpened',
            value
        })
    }
})

const sideWidth = computed({
    get() {
        return settingStore.sideWidth
    },
    set(value) {
        settingStore.setSetting({
            key: 'sideWidth',
            value
        })
    }
})

const showSetting = computed({
    get() {
        return settingStore.showDrawer
    },
    set(value) {
        settingStore.setSetting({
            key: 'showDrawer',
            value
        })
    }
})

const theme = computed({
    get() {
        return settingStore.theme
    },
    set(value) {
        settingStore.setSetting({
            key: 'theme',
            value
        })
        themeChange()
    }
})

const showLogo = computed({
    get() {
        return settingStore.showLogo
    },
    set(value) {
        settingStore.setSetting({
            key: 'showLogo',
            value
        })
    }
})

const showCrumb = computed({
    get() {
        return settingStore.showCrumb
    },
    set(value) {
        settingStore.setSetting({
            key: 'showCrumb',
            value
        })
    }
})

const isDark = useDark()
const themeChange = () => {
    settingStore.setTheme(isDark.value)
}

const toggleDark = () => {
    useToggle(isDark)()
    themeChange()
}

const resetTheme = () => {
    isDark.value = false
    settingStore.resetTheme()
    themeChange()
}
</script>

<style lang="scss" scoped>
.icon-select {
    @apply absolute left-1/2 top-1/2;
    transform: translate(-50%, -50%);
}
</style>
