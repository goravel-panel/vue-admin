<template>
  <div class="edit-popup">
    <popup
      ref="popupRef"
      :async="true"
      :title="popupTitle"
      width="550px"
      @close="handleClose"
      @confirm="handleSubmit"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item
          label="分类名称"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            clearable
            placeholder=""
          />
        </el-form-item>

        <el-form-item
          label="显示顺序"
          prop="sort"
        >
          <div>
            <el-input-number
              v-model="formData.sort"
              :max="9999"
            />
            <div class="form-tips">
              数值越大越排前
            </div>
          </div>
        </el-form-item>

        <el-form-item
          label="显示状态"
          prop="isEnable"
          required
        >
          <el-radio-group v-model="formData.isEnable">
            <el-radio :value="1">
              正常
            </el-radio>
            <el-radio :value="0">
              禁用
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ref } from 'vue'

import { categoryService } from '@/api/article'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'

const mode = ref('add')
const popupTitle = computed(() => {
    return mode.value === 'edit' ? '编辑分类' : '添加分类'
})

const emit = defineEmits(['success'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()

const formData = reactive({
    id: 0,
    name: '',
    sort: 100,
    isEnable: 1
})

const formRules = reactive<FormRules<typeof formData>>({
    name: [
        {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
        }
    ],
    sort: [
        {
            required: true,
            message: '请输入排序数字',
            trigger: 'blur'
        }
    ]
})

const setFormData = async (row: any) => {
    const { data } = await categoryService.getDetail({
        id: row.id
    })
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            formData[key] = data[key]
        }
    }
}
const handleSubmit = async () => {
    await formRef.value?.validate()
    // await updateGoodsType(formData)
    popupRef.value?.close()
    emit('success')
    feedback.success('操作成功')
}

const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

const handleClose = () => {
    formRef.value?.resetFields()
}

defineExpose({
    open,
    setFormData
})
</script>
