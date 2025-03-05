import { isFunction } from 'lodash-es'
import { reactive } from 'vue'

// 分页钩子函数
interface Options<T> {
    pageNo?: number
    pageSize?: number
    pageCount?: number
    fetch: (arg: T) => Promise<any>
    params?: T
    loading?: boolean

    beforeRequest?(params: T): T

    afterRequest?(res: Record<any, any>): void
}

export function usePaging<T>(options: Options<T>) {
    const {
        loading = false,
        pageNo = 1,
        pageSize = 15,
        pageCount = 5,
        params = {} as T,
        fetch,
        beforeRequest,
        afterRequest
    } = options

    if (!isFunction(fetch)) {
        throw new Error('fetch must be a function')
    }

    // 记录分页初始参数
    const paramsInit: Record<any, any> = Object.assign({}, toRaw(params))

    // 分页数据
    const pager = reactive({
        loading: loading,
        pageNo: pageNo,
        pageSize: pageSize,
        pageCount: pageCount,
        total: 0,
        list: [] as any[],
        extend: {} as Record<any, any>
    })
    // 请求分页接口
    const getList = async () => {
        pager.loading = true
        let requestParams = params
        if (isFunction(beforeRequest)) {
            requestParams = beforeRequest(params)
        }
        return fetch({
            pageNo: pager.pageNo,
            pageSize: pager.pageSize,
            ...requestParams
        })
            .then(({ data }) => {
                pager.total = data?.total ?? 0
                pager.list = data?.list ?? []
                pager.extend = data?.extend ?? {}
                if (isFunction(afterRequest)) {
                    afterRequest(data)
                }
                return Promise.resolve(data)
            })
            .catch((err: any) => {
                console.error('Error fetching data:', err)
                return Promise.reject(err)
            })
            .finally(() => {
                pager.loading = false
            })
    }
    // 重置为第一页
    const resetPage = async () => {
        pager.pageNo = 1
        await getList()
    }
    // 重置参数
    const resetParams = async () => {
        Object.keys(paramsInit).forEach((item) => {
            params[item] = paramsInit[item]
        })
        await getList()
    }
    return {
        pager,
        getList,
        resetParams,
        resetPage
    }
}
