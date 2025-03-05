import request from '@/utils/request'

export const appService = {
    // 获取配置信息
    getConfig() {
        return request.get({ url: '/config' })
    },
    // 获取工作台信息
    getWorkbench() {
        return request.get({ url: '/workbench' })
    }
}
