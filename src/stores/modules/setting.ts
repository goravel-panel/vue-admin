import { isObject } from '@vue/shared'
import { defineStore } from 'pinia'

import defaultSetting from '@/config/setting'
import { KeyEnum } from '@/enums/cache'
import cache from '@/utils/cache'
import { setTheme } from '@/utils/theme'

const storageSetting = cache.get(KeyEnum.SETTING)

export const useSettingStore = defineStore('setting', {
    state: () => {
        const state = {
            showDrawer: false,
            ...defaultSetting
        }
        isObject(storageSetting) && Object.assign(state, storageSetting)
        return state
    },
    actions: {
        // 设置布局设置
        setSetting(data: Record<string, any>) {
            const { key, value } = data
            if (this.hasOwnProperty(key)) {
                this[key] = value
            }
            const settings: any = Object.assign({}, this.$state)
            delete settings.showDrawer
            cache.set(KeyEnum.SETTING, settings)
        },
        // 设置主题色
        setTheme(isDark: boolean) {
            setTheme(
                {
                    primary: this.theme,
                    success: this.successTheme,
                    warning: this.warningTheme,
                    danger: this.dangerTheme,
                    error: this.errorTheme,
                    info: this.infoTheme
                },
                isDark
            )
        },
        // 重置主题色
        resetTheme() {
            for (const key in defaultSetting) {
                if (defaultSetting.hasOwnProperty(key)) {
                    this[key] = defaultSetting[key]
                }
            }
            cache.remove(KeyEnum.SETTING)
        }
    }
})

export default useSettingStore
