import config from '@/config'

const cache = {
    key: config.name + '_',
    // 设置缓存(expire为缓存时效)
    set(key: string, value: any, expire?: string): null | undefined {
        key = this.key + key
        let data: any = {
            expire: expire ? this.now() + expire : '',
            value
        }
        if (typeof data === 'object') {
            data = JSON.stringify(data)
        }
        try {
            window.localStorage.setItem(key, data)
        } catch (e) {
            return null
        }
    },
    // 获取缓存
    get(key: string) {
        key = this.key + key
        try {
            const data = window.localStorage.getItem(key)
            if (!data) {
                return null
            }
            const { value, expire } = JSON.parse(data)
            if (expire && expire < this.now()) {
                window.localStorage.removeItem(key)
                return null
            }
            return value
        } catch (e) {
            return null
        }
    },
    // 删除缓存
    remove(key: string) {
        key = this.key + key
        window.localStorage.removeItem(key)
    },
    // 获取当前时间
    now() {
        return Math.round(new Date().getTime() / 1000)
    }
}

export default cache
