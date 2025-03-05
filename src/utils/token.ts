import { KeyEnum } from '@/enums/cache'
import { resetRouter } from '@/router'
import useTabsStore from '@/stores/modules/multipleTabs'
import useUserStore from '@/stores/modules/user'
import cache from '@/utils/cache'

const token = {
    // 获取缓存
    get() {
        return cache.get(KeyEnum.TOKEN)
    },
    // 获取缓存
    clear() {
        const userStore = useUserStore()
        const tabsStore = useTabsStore()
        userStore.resetState()
        tabsStore.$reset()
        cache.remove(KeyEnum.TOKEN)
        resetRouter()
    }
}

export default token
