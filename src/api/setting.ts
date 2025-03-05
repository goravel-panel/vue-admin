import request from '@/utils/request'

export const baseService = {
    // 获取配置详情
    getDetail(params?: Record<string, any>) {
        return request.get({ url: '/config/base/detail', params })
    },
    // 保存配置
    save(params?: Record<string, any>) {
        return request.post({ url: '/config/base/save', params })
    }
}

export const captchaService = {
    // 获取配置详情
    getDetail(params?: Record<string, any>) {
        return request.get({ url: '/config/captcha/detail', params })
    },
    // 保存配置
    save(params?: Record<string, any>) {
        return request.post({ url: '/config/captcha/save', params })
    },
    // 生成验证码
    generate(params?: Record<string, any>) {
        return request.post({ url: '/captcha/generate', params })
    }
}

export const mailService = {
    // 获取配置详情
    getDetail(params?: Record<string, any>) {
        return request.get({ url: '/config/mail/detail', params })
    },
    // 保存配置
    save(params?: Record<string, any>) {
        return request.post({ url: '/config/mail/save', params })
    },
    // 发送邮件
    send(params?: Record<string, any>) {
        return request.post({ url: '/config/mail/send', params })
    }
}

export const storageService = {
    // 获取所有存储
    getAll(params?: Record<string, any>) {
        return request.get({ url: '/config/storage/all', params })
    },
    // 获取存储详情
    getDetail(params?: Record<string, any>) {
        return request.get({ url: '/config/storage/detail', params })
    },
    // 设置默认存储
    setDefault(params?: Record<string, any>) {
        return request.post({ url: '/config/storage/default', params })
    },
    // 保存存储
    save(params?: Record<string, any>) {
        return request.post({ url: '/config/storage/save', params })
    }
}

export const pageService = {
    // 获取所有页面
    getAll(params?: Record<string, any>) {
        return request.get({ url: '/config/page/all', params })
    },
    // 获取页面详情
    getDetail(params?: Record<string, any>) {
        return request.get({ url: '/config/page/detail', params })
    },
    // 保存页面
    save(params?: Record<string, any>) {
        return request.post({ url: '/config/page/save', params })
    },
    // 删除页面
    delete(params?: Record<string, any>) {
        return request.post({ url: '/config/page/delete', params })
    }
}
