import useUserStore from '@/stores/modules/user'

export default {
    mounted: (el: HTMLElement, binding: any) => {
        const { value } = binding
        const userStore = useUserStore()
        const permissions = userStore.perms
        const allPermission = '*'
        if (Array.isArray(value)) {
            if (value.length > 0) {
                const hasPermission = permissions.some((key: string) => {
                    return allPermission === key || value.includes(key)
                })

                if (!hasPermission) {
                    el.parentNode && el.parentNode.removeChild(el)
                }
            }
        } else {
            throw new Error('like v-perms="[\'auth.menu/edit\']"')
        }
    }
}
