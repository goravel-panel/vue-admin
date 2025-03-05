<template>
  <el-breadcrumb class="app-breadcrumb">
    <el-breadcrumb-item
      v-for="item in breadcrumbs"
      :key="item.path"
    >
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script lang="ts" setup>
import type { RouteLocationMatched, RouteLocationNormalizedLoaded } from 'vue-router'

import config from '@/config'
import { MenuEnum } from '@/enums/app'
import { useWatchRoute } from '@/hooks/useWatchRoute'

const breadcrumbs = ref<RouteLocationMatched[]>([])
const getBreadcrumb = (route: RouteLocationNormalizedLoaded) => {
    breadcrumbs.value = route.matched.filter(
        (item) => item.meta && item.meta.type !== MenuEnum.BUTTON && item.meta.title
    )
}

useWatchRoute((route) => {
    getBreadcrumb(route)
    document.title = breadcrumbs.value.at(-1)?.meta.title ?? config.title
})
</script>
