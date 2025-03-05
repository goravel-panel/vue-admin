import config from '@/config'
import request from '@/utils/request'

export const accountService = {
    // 登录
    login(params?: Record<string, any>) {
        return request.post({
            url: '/account/login',
            params: { ...params, terminal: config.terminal }
        })
    },
    // 退出
    logout() {
        return request.get({ url: '/account/logout' })
    },
    // 获取用户信息
    getProfile() {
        return request.get({ url: '/account/profile' })
    },
    // 修改用户信息
    setProfile(params: Record<string, any>) {
        return request.post({ url: '/account/profile', params })
    }
}
