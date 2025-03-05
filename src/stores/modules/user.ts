import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

import { accountService } from '@/api/account'
import { KeyEnum } from '@/enums/cache'
import { PageEnum } from '@/enums/page.ts'
import router, { filterAsyncRoutes } from '@/router'
import cache from '@/utils/cache'
import token from '@/utils/token'

export interface UserState {
    token: string
    profile: Record<string, any>
    routes: RouteRecordRaw[]
    menus: any[]
    perms: string[]
}

const useUserStore = defineStore('user', {
    state: (): UserState => ({
        token: token.get() || '',
        // 用户信息
        profile: {},
        // 路由
        routes: [],
        // 菜单
        menus: [],
        // 权限
        perms: []
    }),
    getters: {},
    actions: {
        resetState() {
            this.token = ''
            this.profile = {}
            this.perms = []
        },
        login(payload: any) {
            return new Promise((resolve, reject) => {
                accountService
                    .login(payload)
                    .then(({ data }) => {
                        this.token = data.token
                        cache.set(KeyEnum.TOKEN, data.token)
                        resolve(data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        logout() {
            return new Promise((resolve, reject) => {
                accountService
                    .logout()
                    .then(async (data) => {
                        this.token = ''
                        token.clear()
                        await router.push(PageEnum.LOGIN)
                        resolve(data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        getProfile() {
            return new Promise((resolve, reject) => {
                accountService
                    .getProfile()
                    .then(({ data }) => {
                        this.profile = data
                        this.menus = data.menus
                        this.perms = data.perms
                        this.routes = filterAsyncRoutes(this.menus)
                        resolve(data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        }
    }
})

export default useUserStore
