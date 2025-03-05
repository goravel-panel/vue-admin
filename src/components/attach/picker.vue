<template>
  <div class="material-select">
    <popup
      ref="popupRef"
      :title="`选择${tipsText}`"
      custom-class="body-padding"
      width="810px"
      @close="handleClose"
      @confirm="handleConfirm"
    >
      <template
        v-if="!hiddenUpload"
        #trigger
      >
        <div
          class="material-select__trigger clearfix"
          @click.stop
        >
          <draggable
            v-model="fileList"
            animation="300"
            class="draggable"
            item-key="id"
          >
            <template #item="{ element, index }">
              <div
                :class="{
                  'is-disabled': disabled,
                  'is-one': limit === 1
                }"
                class="material-preview"
                @click="showPopup(index)"
              >
                <del-wrap @close="handleDelete(index)">
                  <image-thumb
                    :height="height"
                    :type="type"
                    :url="element"
                    :width="width"
                  />
                </del-wrap>
              </div>
            </template>
          </draggable>
          <div
            v-show="showUpload"
            :class="{
              'is-disabled': disabled,
              'is-one': limit === 1,
              [uploadClass]: true
            }"
            class="material-upload"
            @click="showPopup(-1)"
          >
            <slot name="upload">
              <div
                :style="{
                  width: width,
                  height: height
                }"
                class="upload-btn"
              >
                <icon
                  :size="25"
                  name="el-icon-Plus"
                />
                <span>添加</span>
              </div>
            </slot>
          </div>
        </div>
      </template>
      <el-scrollbar>
        <div class="material-wrap">
          <image-wrap
            ref="attachRef"
            :limit="fileLimit"
            :type="type"
            file-size="100px"
            @change="selectChange"
          />
        </div>
      </el-scrollbar>
    </popup>
    <image-preview
      v-if="previewUrl"
      v-model="showPreview"
      :type="type"
      :url="previewUrl"
    />
  </div>
</template>

<script lang="ts">
import { useThrottleFn } from '@vueuse/shared'
import Draggable from 'vuedraggable'

import Popup from '@/components/popup/index.vue'

import ImageWrap from './index.vue'
import ImagePreview from './preview.vue'
import ImageThumb from './thumb.vue'

export default defineComponent({
    components: {
        Popup,
        Draggable,
        ImageThumb,
        ImageWrap,
        ImagePreview
    },
    props: {
        modelValue: {
            type: [String, Array],
            default: () => []
        },
        // 文件类型
        type: {
            type: String,
            default: 'image'
        },
        // 图片宽度
        width: {
            type: String,
            default: '100px'
        },
        // 图片高度
        height: {
            type: String,
            default: '100px'
        },
        // 选择数量限制
        limit: {
            type: Number,
            default: 1
        },
        // 禁用选择
        disabled: {
            type: Boolean,
            default: false
        },
        // 隐藏上传框*(目前在富文本中使用到)
        hiddenUpload: {
            type: Boolean,
            default: false
        },
        uploadClass: {
            type: String,
            default: ''
        },
        //选择的url排出域名
        excludeDomain: {
            type: Boolean,
            default: false
        }
    },

    emits: ['change', 'update:modelValue'],
    setup(props, { emit }) {
        const popupRef = ref<InstanceType<typeof Popup>>()
        const attachRef = ref<InstanceType<typeof ImageWrap>>()
        const previewUrl = ref('')
        const showPreview = ref(false)
        const fileList = ref<any[]>([])
        const select = ref<any[]>([])
        const isAdd = ref(true)
        const currentIndex = ref(-1)
        const { disabled, limit, modelValue } = toRefs(props)
        const tipsText = computed(() => {
            switch (props.type) {
                case 'image':
                    return '图片'
                case 'video':
                    return '视频'
                default:
                    return ''
            }
        })

        const showUpload = computed(() => {
            return props.limit - fileList.value.length > 0
        })

        const fileLimit: any = computed(() => {
            if (!isAdd.value) {
                return 1
            }
            if (limit.value === -1) {
                return null
            }
            return limit.value - fileList.value.length
        })

        const handleConfirm = useThrottleFn(
            () => {
                const selectUri = select.value.map((item) =>
                    props.excludeDomain ? item.path : item.url
                )
                if (isAdd.value) {
                    fileList.value = [...fileList.value, ...selectUri]
                } else {
                    fileList.value.splice(currentIndex.value, 1, selectUri.shift())
                }
                handleChange()
            },
            1000,
            false
        )

        const showPopup = (index: number) => {
            if (disabled.value) {
                return
            }
            if (index >= 0) {
                isAdd.value = false
                currentIndex.value = index
            } else {
                isAdd.value = true
            }
            popupRef.value?.open()
        }

        const selectChange = (val: any[]) => {
            select.value = val
        }

        const handleChange = () => {
            const valueImg = limit.value === 1 ? fileList.value[0] || '' : fileList.value
            emit('update:modelValue', valueImg)
            emit('change', valueImg)
            handleClose()
        }

        const handleDelete = (index: number) => {
            fileList.value.splice(index, 1)
            handleChange()
        }

        const handlePreview = (url: string) => {
            previewUrl.value = url
            showPreview.value = true
        }

        const handleClose = () => {
            nextTick(() => {
                if (props.hiddenUpload) {
                    fileList.value = []
                }
                attachRef.value?.handleClearSelect()
            })
        }

        watch(
            modelValue,
            (val: any[] | string) => {
                if (Array.isArray(val)) {
                    fileList.value = val
                } else if (val === '') {
                    fileList.value = []
                } else {
                    fileList.value = [val]
                }
            },
            {
                immediate: true
            }
        )
        provide('limit', props.limit)
        provide('hiddenUpload', props.hiddenUpload)
        return {
            popupRef,
            attachRef,
            fileList,
            tipsText,
            handleConfirm,
            fileLimit,
            showUpload,
            showPopup,
            selectChange,
            handleDelete,
            previewUrl,
            showPreview,
            handlePreview,
            handleClose
        }
    }
})
</script>

<style lang="scss" scoped>
.el-overlay-dialog .el-dialog .el-dialog__body {
    flex: 1;
}

.material-select {
    width: 800px;

    .material-upload,
    .material-preview {
        position: relative;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 8px;
        margin-bottom: 8px;
        box-sizing: border-box;
        float: left;

        &.is-disabled {
            cursor: not-allowed;
        }

        &.is-one {
            margin-bottom: 0;
        }

        &:hover {
            .operation-btn {
                display: block;
            }
        }

        .operation-btn {
            display: none;
            position: absolute;
            bottom: 0;
            border-radius: 4px;
            width: 100%;
            line-height: 2;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.3);
        }
    }

    .material-upload {
        :deep(.upload-btn) {
            @apply text-tx-secondary box-border rounded border-br border-dashed border flex flex-col justify-center items-center;
        }
    }
}

.material-wrap {
    min-width: 720px;
    height: 430px;
    @apply border-t border-b border-br;
}
</style>
