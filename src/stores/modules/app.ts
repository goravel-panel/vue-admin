import { defineStore } from 'pinia'

import { appService } from '@/api/app'

interface AppSate {
    config: Record<string, any>
    isMobile: boolean
    isCollapsed: boolean
    isRouteShow: boolean
}

const useAppStore = defineStore('app', {
    state: (): AppSate => {
        return {
            config: {},
            isMobile: true,
            isCollapsed: false,
            isRouteShow: true
        }
    },
    actions: {
        getConfig() {
            return new Promise((resolve, reject) => {
                appService
                    .getConfig()
                    .then(({ data }) => {
                        this.config = data
                        resolve(data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        setMobile(value: boolean) {
            this.isMobile = value
        },
        toggleCollapsed(toggle?: boolean) {
            this.isCollapsed = toggle ?? !this.isCollapsed
        },
        refreshView() {
            this.isRouteShow = false
            nextTick(() => {
                this.isRouteShow = true
            }).then()
        }
    }
})

export default useAppStore
