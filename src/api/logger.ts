import request from '@/utils/request'

export const loginLogger = {
    // 获取登录日志列表
    getList(params?: Record<string, any>) {
        return request.get({ url: '/logger/login/list', params })
    },
    // 删除登录日志
    delete(params?: Record<string, any>) {
        return request.post({ url: '/logger/login/delete', params })
    },
    // 清空登录日志
    clear() {
        return request.post({ url: '/logger/login/clear' })
    }
}
