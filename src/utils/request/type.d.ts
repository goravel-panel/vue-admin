import 'axios'

import type { AxiosRequestConfig, AxiosResponse } from 'axios'

declare module 'axios' {
    // 扩展 RouteMeta
    interface AxiosRequestConfig {
        retryCount?: number
        axiosHooks?: AxiosHooks
        requestOptions: RequestOptions
    }
}

export interface AxiosHooks {
    requestInterceptorsHook?: (config: AxiosRequestConfig) => AxiosRequestConfig
    requestInterceptorsCatchHook?: (error: Error) => void
    responseInterceptorsHook?: (
        response: AxiosResponse<ResponseData<T>>
    ) => AxiosResponse<ResponseData> | ResponseData | T
    responseInterceptorsCatchHook?: (error: AxiosError) => void
}

export interface RequestOptions {
    isParamsToData: boolean
    isReturnDefaultResponse: boolean
    isTransformResponse: boolean
    urlPrefix: string
    ignoreCancelToken: boolean
    withToken: boolean
    isOpenRetry: boolean
    retryCount: number
}

export interface ResponseData<T = any> {
    data: T
    code: string
    message: string
}
