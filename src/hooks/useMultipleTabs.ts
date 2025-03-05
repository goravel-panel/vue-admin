import useTabsStore from '@/stores/modules/multipleTabs'
import useSettingStore from '@/stores/modules/setting'

export default function useMultipleTabs() {
    const router = useRouter()
    const route = useRoute()
    const tabsStore = useTabsStore()
    const settingStore = useSettingStore()

    const tabsLists = computed(() => {
        return tabsStore.getTabList
    })

    const currentTab = computed(() => {
        return route.fullPath
    })

    const addTab = () => {
        settingStore.openMultipleTabs && tabsStore.addTab(router)
    }

    const removeTab = async (fullPath?: any) => {
        if (settingStore.openMultipleTabs) {
            await tabsStore.removeTab(fullPath ?? route.fullPath, router)
        }
    }

    const removeOtherTab = async () => {
        settingStore.openMultipleTabs && await tabsStore.removeOtherTab(route)
    }

    const removeAllTab = async () => {
        settingStore.openMultipleTabs && await tabsStore.removeAllTab(router)
    }

    return {
        tabsLists,
        currentTab,
        addTab,
        removeTab,
        removeOtherTab,
        removeAllTab
    }
}
