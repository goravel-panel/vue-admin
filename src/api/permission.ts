import request from '@/utils/request'

export const adminService = {
    // 获取管理员列表
    getList(params?: Record<string, any>) {
        return request.get({ url: '/permission/admin/list', params })
    },
    // 获取管理员详情
    getDetail(params?: Record<string, any>) {
        return request.get({ url: '/permission/admin/detail', params })
    },
    // 设置管理员状态
    setStatus(params?: Record<string, any>) {
        return request.post({ url: '/permission/admin/status', params })
    },
    // 保存管理员
    save(params?: Record<string, any>) {
        return request.post({ url: '/permission/admin/save', params })
    },
    // 删除管理员
    delete(params?: Record<string, any>) {
        return request.post({ url: '/permission/admin/delete', params })
    }
}

export const menuService = {
    // 获取所有菜单
    getAll(params?: Record<string, any>) {
        return request.get({ url: '/permission/menu/all', params })
    },
    // 获取菜单详情
    getDetail(params?: Record<string, any>) {
        return request.get({ url: '/permission/menu/detail', params })
    },
    // 保存菜单
    save(params?: Record<string, any>) {
        return request.post({ url: '/permission/menu/save', params })
    },
    // 删除菜单
    delete(params?: Record<string, any>) {
        return request.post({ url: '/permission/menu/delete', params })
    }
}

export const roleService = {
    // 获取所有角色
    getAll(params?: Record<string, any>) {
        return request.get({ url: '/permission/role/all', params })
    },
    // 获取角色列表
    getList(params?: Record<string, any>) {
        return request.get({ url: '/permission/role/list', params })
    },
    // 获取角色详情
    getDetail(params?: Record<string, any>) {
        return request.get({ url: '/permission/role/detail', params })
    },
    // 设置角色状态
    setStatus(params?: Record<string, any>) {
        return request.post({ url: '/permission/role/status', params })
    },
    // 设置角色权限
    setAuth(params: Record<string, any>) {
        return request.post({ url: '/permission/role/auth', params })
    },
    // 保存角色
    save(params?: Record<string, any>) {
        return request.post({ url: '/permission/role/save', params })
    },
    // 删除角色
    delete(params?: Record<string, any>) {
        return request.post({ url: '/permission/role/delete', params })
    }
}
