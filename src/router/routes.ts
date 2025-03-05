import type { RouteRecordRaw } from 'vue-router'

import { PageEnum } from '@/enums/page'
import Layout from '@/layout/default/index.vue'

export const INDEX_ROUTE_NAME = Symbol()

export const LAYOUT = () => Promise.resolve(Layout)

export const constantRoutes: Array<RouteRecordRaw> = [
    {
        path: PageEnum.Forbidden,
        component: () => import('@/views/error/403.vue')
    },
    {
        path: PageEnum.NotFound,
        component: () => import('@/views/error/404.vue')
    },
    {
        path: PageEnum.ServerError,
        component: () => import('@/views/error/500.vue')
    },
    {
        path: PageEnum.LOGIN,
        component: () => import('@/views/account/login.vue')
    },
    {
        path: '/account',
        component: LAYOUT,
        children: [
            {
                path: 'profile',
                name: Symbol(),
                component: () => import('@/views/account/profile.vue'),
                meta: {
                    title: '个人设置'
                }
            },
            {
                path: 'logger',
                name: Symbol(),
                component: () => import('@/views/logger/my/login.vue'),
                meta: {
                    title: '登录日志'
                }
            }
        ]
    }
]

export const INDEX_ROUTE: RouteRecordRaw = {
    path: PageEnum.INDEX,
    component: LAYOUT,
    name: INDEX_ROUTE_NAME
}
