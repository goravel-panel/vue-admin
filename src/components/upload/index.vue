<template>
  <div class="upload">
    <el-upload
      ref="uploadRefs"
      :accept="getAccept"
      :action="action"
      :data="data"
      :headers="headers"
      :limit="limit"
      :multiple="multiple"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :show-file-list="false"
      name="image"
    >
      <slot />
    </el-upload>
    <el-dialog
      v-if="showProgress && fileList.length"
      v-model="visible"
      :close-on-click-modal="false"
      :modal="false"
      title="上传进度"
      width="500px"
      @close="handleClose"
    >
      <div class="file-list p-4">
        <template
          v-for="item in fileList"
          :key="item.id"
        >
          <div class="mb-5">
            <div>{{ item.name }}</div>
            <div class="flex-1">
              <el-progress :percentage="parseInt(item.percentage)" />
            </div>
          </div>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { type ElUpload } from 'element-plus'
import { computed, defineComponent, ref, shallowRef } from 'vue'

import config from '@/config'
import { ResponseCodeEnum } from '@/enums/response'
import useUserStore from '@/stores/modules/user'
import feedback from '@/utils/feedback'

export default defineComponent({
    components: {},
    props: {
        // 上传文件类型
        type: {
            type: String,
            default: 'image'
        },
        // 是否支持多选
        multiple: {
            type: Boolean,
            default: true
        },
        // 多选时最多选择几条
        limit: {
            type: Number,
            default: 10
        },
        // 上传时的额外参数
        data: {
            type: Object,
            default: () => ({})
        },
        // 是否显示上传进度
        showProgress: {
            type: Boolean,
            default: false
        }
    },
    emits: ['change', 'error', 'success', 'allSuccess'],
    setup(props, { emit }) {
        const userStore = useUserStore()
        const uploadRefs = shallowRef<InstanceType<typeof ElUpload>>()
        const action = ref(`${config.baseUrl}${config.urlPrefix}/upload/${props.type}`)

        const timestamp = Date.now()
        const headers = computed(() => ({
            ['Authorization']: userStore.token,
            ['Timestamp']: timestamp,
        }))
        const visible = ref(false)
        const fileList = ref<any[]>([])
        const uploadLen = ref(0)

        const handleProgress = () => {
            visible.value = true
        }

        const handleSuccess = (response: any, file: any) => {
            uploadLen.value++
            if (uploadLen.value === fileList.value.length) {
                uploadLen.value = 0
                fileList.value = []
                emit('allSuccess')
            }
            emit('change', file)
            if (response.code === ResponseCodeEnum.Success) {
                emit('success', response)
            } else {
                response.message && feedback.error(response.message)
            }
        }
        const handleError = (_: any, file: any) => {
            uploadLen.value++
            if (uploadLen.value === fileList.value.length) {
                uploadLen.value = 0
                fileList.value = []
                emit('allSuccess')
            }
            feedback.error(`${file.name} 文件上传失败`)
            uploadRefs.value?.abort(file)
            visible.value = false
            emit('change', file)
            emit('error', file)
        }
        const handleExceed = () => {
            feedback.error(`超出上传上限 ${props.limit}，请重新上传`)
        }
        const handleClose = () => {
            uploadRefs.value?.clearFiles()
            visible.value = false
        }

        const getAccept = computed(() => {
            switch (props.type) {
                case 'image':
                    return '.jpj,.png,.gif,.jpeg,.ico,.bmp'
                case 'video':
                    return '.wmv,.avi,.mov,.mp4,.flv,.rmvb'
                default:
                    return '*'
            }
        })
        return {
            uploadRefs,
            action,
            headers,
            visible,
            fileList,
            getAccept,
            handleProgress,
            handleSuccess,
            handleError,
            handleExceed,
            handleClose
        }
    }
})
</script>

<style lang="scss"></style>
