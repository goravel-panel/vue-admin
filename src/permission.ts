import 'nprogress/nprogress.css'

import NProgress from 'nprogress'

import { MenuEnum } from '@/enums/app'

import { PageEnum } from './enums/page'
import router, { findFirstValidRoute } from './router'
import { INDEX_ROUTE, INDEX_ROUTE_NAME } from './router/routes'
import useTabsStore from './stores/modules/multipleTabs'
import useUserStore from './stores/modules/user'
import token from './utils/token'

// NProgress配置
NProgress.configure({ showSpinner: false })

const loginPath = PageEnum.LOGIN
const defaultPath = PageEnum.INDEX

// 免登录白名单
const whiteList: string[] = [PageEnum.LOGIN, PageEnum.Forbidden]
router.beforeEach(async (to, from, next) => {
    // 开始 Progress Bar
    NProgress.start()

    const userStore = useUserStore()
    const tabsStore = useTabsStore()
    if (whiteList.includes(to.path)) {
        // 在免登录白名单，直接进入
        next()
    } else if (userStore.token) {
        // 获取用户信息
        const hasGetUserInfo = Object.keys(userStore.profile).length !== 0
        if (hasGetUserInfo) {
            if (to.path === loginPath) {
                next({ path: defaultPath })
            } else {
                next()
            }
        } else {
            try {
                await userStore.getProfile()
                const routes = userStore.routes
                // 找到第一个有效路由
                const routeName = findFirstValidRoute(routes)
                // 没有有效路由跳转到 403 页面
                if (!routeName) {
                    next(PageEnum.Forbidden)
                    return
                }
                tabsStore.setRouteName(routeName!)
                INDEX_ROUTE.redirect = { name: routeName }
                // 动态添加 index 路由
                router.addRoute(INDEX_ROUTE)
                routes.forEach((route: any) => {
                    // 链接则不插入
                    if (route.meta.type === MenuEnum.LINK) {
                        return
                    }
                    if (!route.children) {
                        router.addRoute(INDEX_ROUTE_NAME, route)
                        return
                    }
                    // 动态添加可访问路由表
                    router.addRoute(route)
                })
                next({ ...to, replace: true })
            } catch (err) {
                token.clear()
                await router.push(PageEnum.LOGIN)
                next({ path: loginPath, query: { redirect: to.fullPath } })
            }
        }
    } else {
        next({ path: loginPath, query: { redirect: to.fullPath } })
    }
})

router.afterEach(() => {
    NProgress.done()
})
