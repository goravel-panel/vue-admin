import { ElMessage, ElMessageBox, type ElMessageBoxOptions, ElNotification } from 'element-plus'

const feedback = {
    // 提示框
    info(msg: string) {
        ElMessage.info(msg)
    },

    // 成功框
    success(msg: string) {
        ElMessage.success(msg)
    },

    // 错误框
    error(msg: string) {
        ElMessage.error(msg)
    },

    // 警告框
    warning(msg: string) {
        ElMessage.warning(msg)
    },

    // 提示框
    async alert(msg: string, type: string) {
        switch (type) {
            case 'error':
                await ElMessageBox.alert(msg, '系统提示', { type: 'error' })
                break
            case 'warning':
                await ElMessageBox.alert(msg, '系统提示', { type: 'warning' })
                break
            case 'success':
                await ElMessageBox.alert(msg, '系统提示', { type: 'success' })
                break
            case 'info':
                await ElMessageBox.alert(msg, '系统提示', { type: 'info' })
                break
            default:
                await ElMessageBox.alert(msg, '系统提示')
                break
        }
    },

    // 通知提示
    notify(msg: string, type: string) {
        switch (type) {
            case 'error':
                ElNotification.error(msg)
                break
            case 'warning':
                ElNotification.warning(msg)
                break
            case 'success':
                ElNotification.success(msg)
                break
            case 'info':
                ElNotification.info(msg)
                break
            default:
                ElNotification.info(msg)
                break
        }
    },

    // 确认提示
    async confirm(msg: string, type: string) {
        switch (type) {
            case 'error':
                await ElMessageBox.confirm(msg, '温馨提示', {
                    type: 'error',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                })
                break
            case 'warning':
                await ElMessageBox.confirm(msg, '温馨提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                })
                break
            case 'success':
                await ElMessageBox.confirm(msg, '温馨提示', {
                    type: 'success',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                })
                break
            default:
                await ElMessageBox.confirm(msg)
                break
        }
    },

    // 提交内容
    prompt(content: string, title: string, options?: ElMessageBoxOptions) {
        return ElMessageBox.prompt(content, title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            ...options
        })
    }
}

export default feedback
