<template>
  <div
    @mouseenter="inPopover = true"
    @mouseleave="inPopover = false"
  >
    <el-popover
      v-model:visible="visible"
      :persistent="false"
      :teleported="teleported"
      :width="width"
      class="popover-input"
      placement="top"
      popper-class="!p-0"
      trigger="contextmenu"
    >
      <div
        class="flex p-3"
        @click.stop=""
      >
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
        >
          <div class="popover-input__input mr-[10px] flex-1">
            <el-select
              v-if="type === 'select'"
              v-model="formData.inputValue"
              :size="size"
              :teleported="teleported"
              class="flex-1"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input
              v-else
              v-model.trim="formData.inputValue"
              :maxlength="limit"
              :placeholder="placeholder"
              :show-word-limit="showLimit"
              :size="size"
              :type="type"
              clearable
            />
          </div>
        </el-form>
        <div class="popover-input__btns flex-none">
          <el-button
            link
            @click="handleClose"
          >
            取消
          </el-button>
          <el-button
            :size="size"
            type="primary"
            @click="handleConfirm"
          >
            确定
          </el-button>
        </div>
      </div>
      <template #reference>
        <div
          class="inline"
          @click.stop="handleOpen"
        >
          <slot />
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import type { FormInstance, FormRules } from 'element-plus'
import type { PropType } from 'vue'

const formRef = ref<FormInstance>()
const formData = reactive({
    inputValue: ''
})

const formRules = reactive<FormRules<typeof formData>>({
    inputValue: [
        {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
        }
    ]
})

const props = defineProps({
    value: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'text'
    },
    width: {
        type: [Number, String],
        default: '300px'
    },
    placeholder: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    options: {
        type: Array as PropType<any[]>,
        default: () => []
    },
    size: {
        type: String as PropType<'default' | 'small' | 'large'>,
        default: 'default'
    },
    limit: {
        type: Number,
        default: 200
    },
    showLimit: {
        type: Boolean,
        default: false
    },
    teleported: {
        type: Boolean,
        default: true
    }
})

const visible = ref(false)
const inPopover = ref(false)

const emit = defineEmits(['confirm'])

const handleConfirm = async () => {
    await formRef.value?.validate()
    if (formData.inputValue.length === 0) {
        return
    }
    handleClose()
    emit('confirm', formData.inputValue)
}

const handleOpen = () => {
    if (props.disabled) {
        return
    }
    visible.value = true
}

const handleClose = () => {
    visible.value = false
}

watch(
    () => props.value,
    (value) => {
        formData.inputValue = value
    },
    {
        immediate: true
    }
)

useEventListener(document.documentElement, 'click', () => {
    if (inPopover.value) {
        return
    }
    handleClose()
})
</script>