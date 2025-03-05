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
        class="ls-form"
        label-width="60px"
      >
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            class="ls-input"
            clearable
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="formData.remark"
            :autosize="{ minRows: 4, maxRows: 6 }"
            maxlength="200"
            placeholder="请输入备注"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          label="排序"
          prop="sort"
        >
          <el-input-number v-model="formData.sort" />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="sort"
        >
          <el-switch
            v-model="formData.isEnable"
            :active-value="1"
            :inactive-value="0"
          />
          <span class="ml-2">{{ formData.isEnable === 1 ? '启用' : '停用' }}</span>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { reactive } from 'vue'

import { roleService } from '@/api/permission'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
    return mode.value === 'edit' ? '编辑角色' : '新增角色'
})

// 表单数据
const formData = reactive({
    id: 0,
    name: '',
    remark: '',
    sort: 0,
    isEnable: 1
})

// 表单验证
const formRules = reactive<FormRules<typeof formData>>({
    name: [
        {
            required: true,
            message: '请输入名称',
            trigger: ['blur']
        }
    ]
})

const handleClose = () => {
    emit('close')
}

const handleOpen = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

const setFormData = async (row: Record<any, any>) => {
    const { data } = await roleService.getDetail({
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
    await roleService.save(formData)
    popupRef.value?.close()
    feedback.success('操作成功')
    emit('success')
}

defineExpose({
    handleOpen,
    setFormData
})
</script>
