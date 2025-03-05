import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from 'axios'
import { cloneDeep, isFunction, merge } from 'lodash-es'

import { RequestMethodEnum } from '@/enums/request'

import axiosCancel from './cancel'
import type { RequestOptions, ResponseData } from './type'

export class Axios {
    private readonly axiosInstance: AxiosInstance
    private readonly config: AxiosRequestConfig
    private readonly options: RequestOptions

    constructor(config: AxiosRequestConfig) {
        this.config = config
        this.options = config.requestOptions
        this.axiosInstance = axios.create(config)
        this.setupInterceptors()
    }

    /**
     * @description 设置拦截器
     */
    setupInterceptors() {
        if (!this.config.axiosHooks) {
            return
        }
        const {
            requestInterceptorsHook,
            requestInterceptorsCatchHook,
            responseInterceptorsHook,
            responseInterceptorsCatchHook
        } = this.config.axiosHooks
        this.axiosInstance.interceptors.request.use(
            (config: any) => {
                this.addCancelToken(config)
                if (isFunction(requestInterceptorsHook)) {
                    config = requestInterceptorsHook(config) as InternalAxiosRequestConfig
                }
                return config
            },
            (err: Error) => {
                if (isFunction(requestInterceptorsCatchHook)) {
                    requestInterceptorsCatchHook(err)
                }
                return err
            }
        )
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse<ResponseData>) => {
                this.removeCancelToken(response.config.url!)
                if (isFunction(responseInterceptorsHook)) {
                    response = responseInterceptorsHook(response) as AxiosResponse<ResponseData>
                }
                return response
            },
            (err: AxiosError) => {
                if (isFunction(responseInterceptorsCatchHook)) {
                    responseInterceptorsCatchHook(err)
                }
                if (err.code !== AxiosError.ERR_CANCELED) {
                    this.removeCancelToken(err.config?.url!)
                }
                if (err.code === AxiosError.ECONNABORTED || err.code === AxiosError.ERR_NETWORK) {
                    return this.retryRequest(err)
                }
                return Promise.reject(err)
            }
        )
    }

    /**
     * @description 添加CancelToken
     */
    addCancelToken(config: AxiosRequestConfig) {
        const { ignoreCancelToken } = config.requestOptions
        !ignoreCancelToken && axiosCancel.add(config)
    }

    /**
     * @description 移除CancelToken
     */
    removeCancelToken(url: string) {
        axiosCancel.remove(url)
    }

    /**
     * @description 重新请求
     */
    retryRequest(error: AxiosError) {
        const config = error.config
        if (!config) {
            return Promise.reject(error)
        }
        const { retryCount, isOpenRetry } = config.requestOptions || {}
        if (!isOpenRetry || config.method?.toUpperCase() === RequestMethodEnum.POST) {
            return Promise.reject(error)
        }
        config.retryCount = (config.retryCount || 0) + 1

        if (config.retryCount >= retryCount) {
            return Promise.reject(error)
        }

        return this.axiosInstance.request(config)
    }

    /**
     * @description get请求
     */
    get<T = any>(
        config: Partial<AxiosRequestConfig>,
        options?: Partial<RequestOptions>
    ): Promise<T> {
        return this.request({ ...config, method: RequestMethodEnum.GET }, options)
    }

    /**
     * @description post请求
     */
    post<T = any>(
        config: Partial<AxiosRequestConfig>,
        options?: Partial<RequestOptions>
    ): Promise<T> {
        return this.request({ ...config, method: RequestMethodEnum.POST }, options)
    }

    /**
     * @description 请求函数
     */
    request<T = any>(
        config: Partial<AxiosRequestConfig>,
        options?: Partial<RequestOptions>
    ): Promise<any> {
        const opt: RequestOptions = merge({}, this.options, options)
        const axiosConfig: AxiosRequestConfig = {
            ...cloneDeep(config),
            requestOptions: opt
        }
        const { urlPrefix } = opt
        // 拼接请求前缀如api
        if (urlPrefix) {
            axiosConfig.url = `${urlPrefix}${config.url}`
        }
        return new Promise((resolve, reject) => {
            this.axiosInstance
                .request<any, AxiosResponse<ResponseData<T>>>(axiosConfig)
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
}
