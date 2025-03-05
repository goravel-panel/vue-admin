import request from '@/utils/request'

export const attachService = {
    // 获取附件列表
    getList(params?: Record<string, any>) {
        return request.get({ url: '/attach/list', params })
    },
    // 重命名附件
    rename(params?: Record<string, any>) {
        return request.post({ url: '/attach/rename', params })
    },
    // 移动附件
    move(params?: Record<string, any>) {
        return request.post({ url: '/attach/move', params })
    },
    // 删除附件
    delete(params?: Record<string, any>) {
        return request.post({ url: '/attach/delete', params })
    }
}

export const categoryService = {
    // 获取所有分类
    getAll(params?: Record<string, any>) {
        return request.get({ url: '/attach/category/all', params })
    },
    // 删除分类
    save(params?: Record<string, any>) {
        return request.post({ url: '/attach/category/save', params })
    },
    // 重命名分类
    rename(params?: Record<string, any>) {
        return request.post({ url: '/attach/category/rename', params })
    },
    // 删除分类
    delete(params?: Record<string, any>) {
        return request.post({ url: '/attach/category/delete', params })
    }
}
