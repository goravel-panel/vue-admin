import request from '@/utils/request'

export const articleService = {
    getList(params?: Record<string, any>) {
        return request.get({ url: '/article/list', params })
    },

    getDetail(params?: Record<string, any>) {
        return request.get({ url: '/article/detail', params })
    },

    save(params?: Record<string, any>) {
        return request.post({ url: '/article/save', params })
    },

    delete(params?: Record<string, any>) {
        return request.post({ url: '/article/delete', params })
    }
}

export const categoryService = {
    getAll(params?: Record<string, any>) {
        return request.get({ url: '/article/category/all', params })
    },

    getList(params?: Record<string, any>) {
        return request.get({ url: '/article/category/list', params })
    },

    getDetail(params?: Record<string, any>) {
        return request.get({ url: '/article/category/detail', params })
    },

    save(params?: Record<string, any>) {
        return request.post({ url: '/article/category/save', params })
    },

    delete(params?: Record<string, any>) {
        return request.post({ url: '/article/category/delete', params })
    }
}
