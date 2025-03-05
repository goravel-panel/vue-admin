import { isObject } from '@vue/shared'
import { cloneDeep, isEmpty } from 'lodash-es'

/**
 * @description 添加单位
 * @param {String | Number} value 值 100
 * @param {String} unit 单位 px em rem
 */
export const addUnit = (value: string | number, unit: string = 'px'): string | number => {
    return Object.is(Number(value), NaN) ? value : `${value}${unit}`
}

/**
 * @description 获取正确的路经
 * @param {String} path  数据
 */
export const getNormalPath = (path: string) => {
    if (path.length === 0 || !path || path === 'undefined') {
        return path
    }
    const newPath = path.replace('//', '/')
    const length = newPath.length
    if (newPath[length - 1] === '/') {
        return newPath.slice(0, length - 1)
    }
    return newPath
}

/**
 * @description 树转数组，队列实现广度优先遍历
 * @param {Array} data  数据
 * @param {Object} props `{ children: 'children' }`
 */
export const treeToArray = (
    data: any[],
    props: { children?: string } = { children: 'children' }
): any[] => {
    const { children = 'children' } = props
    const newData: any[] = []
    const queue: any[] = []
    const cloneData = cloneDeep(data)
    cloneData.forEach((child: any) => queue.push(child))
    while (queue.length) {
        const item: any = queue.shift()
        if (item[children]) {
            item[children].forEach((child: any) => queue.push(child))
            delete item[children]
        }
        newData.push(item)
    }
    return newData
}

/**
 * @description 数组转树结构
 * @param {Array} data  数据
 * @param {Object} props `{ parent: 'pid', children: 'children' }`
 */
export const arrayToTree = (
    data: Array<{ [key: string]: any }>,
    props: { id?: string; parentId?: string; children?: string } = {
        id: 'id',
        parentId: 'pid',
        children: 'children'
    }
): Array<{ [key: string]: any }> => {
    data = cloneDeep(data)
    const { id = 'id', parentId = 'pid', children = 'children' } = props
    const result: Array<{ [key: string]: any }> = []
    if (!Array.isArray(data)) {
        return result
    }
    const map = new Map()
    data.forEach((item) => {
        map.set(item[id], item)
        const parent = map.get(item[parentId])
        if (parent) {
            if (!Array.isArray(parent[children])) {
                parent[children] = []
            }
            parent[children].push(item)
        } else {
            result.push(item)
        }
    })
    return result
}

/**
 * @description 对象格式化为Query语法
 * @param { Object } params
 * @return {string} Query语法
 */
export const objectToQuery = (params: Record<string, any>): string => {
    let query = ''
    for (const props of Object.keys(params)) {
        const value = params[props]
        const part = encodeURIComponent(props) + '='
        if (!isEmpty(value)) {
            if (isObject(value)) {
                for (const key of Object.keys(value)) {
                    if (!isEmpty(value[key])) {
                        const params = props + '[' + key + ']'
                        const subPart = encodeURIComponent(params) + '='
                        query += subPart + encodeURIComponent(value[key]) + '&'
                    }
                }
            } else {
                query += part + encodeURIComponent(value) + '&'
            }
        }
    }
    return query.slice(0, -1)
}