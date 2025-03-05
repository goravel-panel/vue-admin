import { type AxiosRequestConfig } from 'axios'
import { merge } from 'lodash-es'
import NProgress from 'nprogress'

import configs from '@/config'
import { PageEnum } from '@/enums/page'
import { ContentTypeEnum, RequestMethodEnum } from '@/enums/request'
import { ResponseCodeEnum } from '@/enums/response'
import router from '@/router'
import feedback from '@/utils/feedback'
import token from '@/utils/token'

import { Axios } from './axios'
import type { AxiosHooks } from './type'

// 处理axios的钩子函数
const axiosHooks: AxiosHooks = {
    requestInterceptorsHook(config: AxiosRequestConfig) {
        NProgress.start()
        const { withToken, isParamsToData } = config.requestOptions
        const params = config.params || {}
        const headers = config.headers || {}

        if (withToken) {
            headers['Authorization'] = token.get()
        }
        headers['Timestamp'] = Date.now()
        // POST 请求下如果无 data，则将 params 视为 data
        if (
            isParamsToData &&
            !Reflect.has(config, 'data') &&
            config.method?.toUpperCase() === RequestMethodEnum.POST
        ) {
            config.data = params
            config.params = {}
        }
        config.headers = headers
        return config
    },
    async requestInterceptorsCatchHook(err) {
        NProgress.done()
        return err
    },
    async responseInterceptorsHook(response) {
        NProgress.done()
        const { isTransformResponse, isReturnDefaultResponse } = response.config.requestOptions

        //返回默认响应，当需要获取响应头及其他数据时可使用
        if (isReturnDefaultResponse) {
            return response
        }
        // 是否需要对数据进行处理
        if (!isTransformResponse) {
            return response.data
        }
        return response.data
    },
    async responseInterceptorsCatchHook(error) {
        NProgress.done()
        const { data } = error.response || {}
        switch (error.status) {
            case 401:
                token.clear()
                await router.push(PageEnum.LOGIN)
                return Promise.reject(new Error(data?.message || ResponseCodeEnum.Unauthorized))
            case 403:
                data?.message && feedback.error(data?.message)
                token.clear()
                await router.push(PageEnum.LOGIN)
                return Promise.reject(new Error(data?.message || ResponseCodeEnum.Forbidden))
            case 404:
                await router.push(PageEnum.NotFound)
                return Promise.reject(new Error(data?.message || ResponseCodeEnum.NotFound))
            case 500:
                await router.push(PageEnum.ServerError)
                return Promise.reject(new Error(data?.message || ResponseCodeEnum.ServerError))
            default:
                data?.message && feedback.error(data?.message)
                return Promise.reject(new Error(data?.message || ResponseCodeEnum.BadRequest))
        }
    }
}

const defaultOptions: AxiosRequestConfig = {
    // 超时时间
    timeout: configs.timeout,
    // 基础地址
    baseURL: configs.baseUrl,
    // 请求头
    headers: { 'Content-Type': ContentTypeEnum.JSON },
    axiosHooks: axiosHooks,
    requestOptions: {
        // 是否将params视为data参数，仅限post请求
        isParamsToData: true,
        // 是否返回默认的响应
        isReturnDefaultResponse: false,
        // 需要对返回数据进行处理
        isTransformResponse: true,
        // 接口拼接地址
        urlPrefix: configs.urlPrefix,
        // 忽略重复请求
        ignoreCancelToken: false,
        // 是否携带token
        withToken: true,
        // 开启请求超时重试机制
        isOpenRetry: false,
        // 重新请求次数
        retryCount: 1
    }
}

function createAxios(opt?: Partial<AxiosRequestConfig>) {
    return new Axios(
        // 深度合并
        merge(defaultOptions, opt || {})
    )
}

const request = createAxios()
export default request
