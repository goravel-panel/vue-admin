import { defineStore } from 'pinia'
import type { LocationQuery, RouteLocationNormalized, RouteParamsRaw, Router, RouteRecordName } from 'vue-router'

import { MenuEnum } from '@/enums/app'
import { PageEnum } from '@/enums/page'

interface TabItem {
    name: RouteRecordName
    fullPath: string
    path: string
    title?: string
    query?: LocationQuery
    params?: RouteParamsRaw
}

interface TabsSate {
    cacheTabList: Set<string>
    tabList: TabItem[]
    tasMap: Record<string, TabItem>
    indexRouteName: RouteRecordName
}

const getHasTabIndex = (fullPath: string, tabList: TabItem[]) => {
    return tabList.findIndex((item) => item.fullPath === fullPath)
}

const isCannotAddRoute = (route: RouteLocationNormalized, router: Router) => {
    const { path, meta, name } = route
    if (!path || meta.type === MenuEnum.LINK) {
        return true
    }
    if (meta?.hideTab) {
        return true
    }
    if (!router.hasRoute(name!)) {
        return true
    }
    return ([PageEnum.LOGIN, PageEnum.Forbidden] as string[]).includes(path)
}

const findTabsIndex = (fullPath: string, tabList: TabItem[]) => {
    return tabList.findIndex((item) => item.fullPath === fullPath)
}

const getComponentName = (route: RouteLocationNormalized) => {
    return route.matched.at(-1)?.components?.default?.name
}

export const getRouteParams = (tabItem: TabItem) => {
    const { params, path, query } = tabItem
    return {
        params: params || {},
        path,
        query: query || {}
    }
}

const useTabsStore = defineStore('tabs', {
    state: (): TabsSate => ({
        cacheTabList: new Set(),
        tabList: [],
        tasMap: {},
        indexRouteName: ''
    }),
    getters: {
        getTabList(): TabItem[] {
            return this.tabList
        },
        getCacheTabList(): string[] {
            return Array.from(this.cacheTabList)
        }
    },
    actions: {
        setRouteName(name: RouteRecordName) {
            this.indexRouteName = name
        },
        addCache(componentName?: string) {
            componentName && this.cacheTabList.add(componentName)
        },
        removeCache(componentName?: string) {
            if (componentName && this.cacheTabList.has(componentName)) {
                this.cacheTabList.delete(componentName)
            }
            // console.log(this.cacheTabList)
        },
        clearCache() {
            this.cacheTabList.clear()
        },
        resetState() {
            this.cacheTabList = new Set()
            this.tabList = []
            this.tasMap = {}
            this.indexRouteName = ''
        },
        addTab(router: Router) {
            const route = unref(router.currentRoute)
            const { name, query, meta, params, fullPath, path } = route
            if (isCannotAddRoute(route, router)) {
                return
            }
            const hasTabIndex = getHasTabIndex(fullPath!, this.tabList)
            const componentName = getComponentName(route)
            const tabItem = {
                name: name!,
                path,
                fullPath,
                title: meta?.title,
                query,
                params
            }
            this.tasMap[fullPath] = tabItem
            if (meta?.keepAlive) {
                this.addCache(componentName)
            }
            if (hasTabIndex !== -1) {
                return
            }

            this.tabList.push(tabItem)
        },
        async removeTab(fullPath: string, router: Router) {
            const { currentRoute, push } = router
            const index = findTabsIndex(fullPath, this.tabList)
            // 移除 tab
            if (this.tabList.length > 1) {
                index !== -1 && this.tabList.splice(index, 1)
            }
            const componentName = getComponentName(currentRoute.value)
            this.removeCache(componentName)
            if (fullPath !== currentRoute.value.fullPath) {
                return
            }
            // 删除选中的 tab
            let toTab: TabItem | null = null

            if (index === 0) {
                toTab = this.tabList[index]
            } else {
                toTab = this.tabList[index - 1]
            }

            const toRoute = getRouteParams(toTab)
            await push(toRoute)
        },
        async removeOtherTab(route: RouteLocationNormalized) {
            this.tabList = this.tabList.filter((item) => item.fullPath === route.fullPath)
            const componentName = getComponentName(route)
            this.cacheTabList.forEach((name) => {
                if (componentName !== name) {
                    this.removeCache(name)
                }
            })
        },
        async removeAllTab(router: Router) {
            const { push, currentRoute } = router
            const { name } = unref(currentRoute)
            if (name === this.indexRouteName) {
                await this.removeOtherTab(currentRoute.value)
                return
            }
            this.tabList = []
            this.clearCache()
            await push(PageEnum.INDEX)
        }
    }
})

export default useTabsStore
