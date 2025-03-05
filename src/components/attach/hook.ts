import { useClipboard } from '@vueuse/core'
import { ElTree } from 'element-plus'
import { type Ref, shallowRef } from 'vue'

import { attachService, categoryService } from '@/api/attach'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'

const {  copy, isSupported } = useClipboard()

// 附件分组钩子函数
export function useCate(type: string) {
    const treeRef = shallowRef<InstanceType<typeof ElTree>>()
    // 分组列表
    const cateList = ref<any[]>([])

    // 选中的分组id
    const cateId = ref<number | string>('')

    // 获取分组列表
    const getCateAll = async () => {
        const { data } = await categoryService.getAll({
            type
        })
        const item: any[] = [
            {
                name: '全部',
                id: 0
            }
        ]
        cateList.value = data
        cateList.value.unshift(...item)
        setTimeout(() => {
            treeRef.value?.setCurrentKey(cateId.value)
        }, 0)
    }

    // 添加分组
    const handleCateAdd = async (value: string) => {
        if (!value) {
            feedback.error('分组名不能为空')
            return
        }
        await categoryService.save({
            pid: 0,
            name: value
        })
        await getCateAll()
    }

    // 重命名分组
    const handleCateRename = async (value: string, id: number) => {
        await categoryService.rename({
            id: id,
            name: value
        })
        await getCateAll()
    }

    // 删除分组
    const handleCateDelete = async (id: number) => {
        await feedback.confirm('确定要删除？', 'warning')
        await categoryService.delete({ id })
        await getCateAll()
        cateId.value = ''
        feedback.success('删除成功')
    }

    //选中分类
    const handleCateSelect = (item: any) => {
        cateId.value = item.id
    }

    return {
        treeRef,
        cateId,
        cateList,
        getCateAll,
        handleCateAdd,
        handleCateRename,
        handleCateDelete,
        handleCateSelect
    }
}

// 附件钩子函数
export function useFile(
    cateId: Ref<string | number>,
    type: Ref<string>,
    limit: Ref<number>,
    pageSize: number
) {
    const moveId = ref(0)
    const selectedFiles = ref<any[]>([])
    const queryParams = reactive({
        name: '',
        mime: '',
        type: type,
        cid: cateId
    })
    const { pager, getList, resetPage } = usePaging({
        fetch: attachService.getList,
        params: queryParams,
        loading: true,
        pageSize: pageSize
    })

    const getFileList = async () => {
        await getList()
    }

    const handleFileRefresh = async () => {
        await resetPage()
    }

    const isSelected = (id: number) => {
        return !!selectedFiles.value.find((item: any) => item.id === id)
    }

    const handleFileSelect = (item: any) => {
        const index = selectedFiles.value.findIndex((items: any) => items.id === item.id)
        if (index !== -1) {
            selectedFiles.value.splice(index, 1)
            return
        }
        if (selectedFiles.value.length === limit.value) {
            if (limit.value === 1) {
                selectedFiles.value = []
                selectedFiles.value.push(item)
                return
            }
            feedback.warning('已达到选择上限')
            return
        }
        selectedFiles.value.push(item)
    }

    const handleClearSelect = () => {
        selectedFiles.value = []
    }

    const handleCancelSelect = (id: number) => {
        selectedFiles.value = selectedFiles.value.filter((item: any) => item.id !== id)
    }

    const handleFileRename = async (value: string, id: number) => {
        await attachService.rename({
            id: id,
            name: value
        })
        await getFileList()
        feedback.success('重命名成功')
    }

    const handleFileMove = async () => {
        const ids = selectedFiles.value.map((item: any) => item.id)
        await attachService.move({ ids, cid: moveId.value })
        feedback.success('移动成功')
        moveId.value = 0
        await getFileList()
        handleClearSelect()
    }

    const handleFileCopy = async (url: string) => {
        if (!isSupported) {
            console.log('Your browser does not support Clipboard API')
            feedback.success('图片地址复制失败')
        }
        await copy(url)
        feedback.success('图片地址复制成功')
    }

    const handleFileDelete = async (id?: number[]) => {
        await feedback.confirm(
            '确认删除后，本地或云存储文件也将同步删除，如文件已被使用，请谨慎操作！',
            'warning'
        )
        const ids = id ? id : selectedFiles.value.map((item: any) => item.id)
        await attachService.delete({ ids })
        handleClearSelect()
        await getFileList()
        feedback.success('删除成功')
    }

    return {
        moveId,
        pager,
        queryParams,
        selectedFiles,
        isSelected,
        getFileList,
        handleFileRefresh,
        handleFileDelete,
        handleFileSelect,
        handleClearSelect,
        handleCancelSelect,
        handleFileRename,
        handleFileCopy,
        handleFileMove
    }
}
