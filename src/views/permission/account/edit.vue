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
        label-width="84px"
      >
        <el-form-item label="用户头像">
          <div>
            <div>
              <attach-picker
                v-model="formData.avatar"
                :limit="1"
              />
            </div>
            <div class="form-tips">
              建议尺寸：100*100px，支持jpg，jpeg，png格式
            </div>
          </div>
        </el-form-item>

        <el-form-item
          label="登录账号"
          prop="account"
        >
          <el-input
            v-model="formData.account"
            :disabled="isRoot === true"
            clearable
            placeholder="请输入登录账号"
          />
        </el-form-item>

        <el-form-item
          label="用户名称"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            clearable
            placeholder="请输入用户名称，建议输入真实姓名"
          />
        </el-form-item>

        <el-form-item label="用户角色">
          <el-input
            v-if="formData.isRoot === 1"
            disabled
            value="超级管理员"
          />
          <el-select
            v-else
            v-model="formData.roleIds"
            class="flex-1"
            clearable
            multiple
            placeholder="请选择用户角色"
          >
            <el-option
              v-for="(item, index) in options.roles"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="登录密码"
          prop="password"
        >
          <el-input
            v-model.trim="formData.password"
            autocomplete="new-password"
            clearable
            placeholder="请输入登录密码"
            show-password
          />
        </el-form-item>

        <el-form-item
          label="确认密码"
          prop="passwordConfirm"
        >
          <el-input
            v-model.trim="formData.passwordConfirm"
            clearable
            placeholder="请输入确认密码"
            show-password
          />
        </el-form-item>

        <el-form-item
          label="用户状态"
          prop="isEnable"
        >
          <el-switch
            v-model="formData.isEnable"
            :active-value="1"
            :disabled="formData.isRoot === 1"
            :inactive-value="0"
          />
          <div
            v-if="formData.isRoot === 1"
            class="ml-1"
          >
            超级管理员不允许禁用
          </div>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { adminService, roleService } from '@/api/permission'
import Popup from '@/components/popup/index.vue'
import { useOptions } from '@/hooks/useOptions'
import useUserStore from '@/stores/modules/user'
import feedback from '@/utils/feedback'

const userStore = useUserStore()
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')

const popupTitle = computed(() => {
    return mode.value === 'edit' ? '编辑账号' : '新增账号'
})

const isRoot = computed(() => {
    return formData.id === 1
})

// 表单数据
const formData = reactive({
    id: 0,
    account: '',
    name: '',
    roleIds: [],
    avatar: '',
    password: '',
    passwordConfirm: '',
    isRoot: 0,
    isEnable: 1
})

const passwordConfirmValidator = (_: object, value: string, callback: any) => {
    if (formData.password) {
        if (!value) {
            callback(new Error('请再次输入密码'))
        }
        if (value !== formData.password) {
            callback(new Error('两次输入密码不一致!'))
        }
    }
    callback()
}

// 表单验证
const formRules = reactive<FormRules<typeof formData>>({
    account: [
        {
            required: true,
            message: '请输入登录账号',
            trigger: ['blur']
        }
    ],
    name: [
        {
            required: true,
            message: '请输入用户名称',
            trigger: ['blur']
        }
    ],
    roleIds: [
        {
            type: 'array',
            required: true,
            message: '请选择权限角色',
            trigger: ['blur']
        }
    ],
    password: [
        {
            required: true,
            message: '请输入登录密码',
            trigger: 'blur'
        }
    ] as any[],
    passwordConfirm: [
        {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
        },
        {
            validator: passwordConfirmValidator,
            trigger: 'blur'
        }
    ] as any[]
})

const { options } = useOptions<{
    roles: any[]
}>({
    roles: {
        fetch: roleService.getAll
    }
})

const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

const setFormData = async (row: any) => {
    formRules.password = []
    formRules.passwordConfirm = [
        {
            validator: passwordConfirmValidator,
            trigger: 'blur'
        }
    ]
    const { data } = await adminService.getDetail({
        id: row.id
    })
    for (const key in formData) {
        if (key === 'roleIds' && data['roles']?.length > 0) {
            formData['roleIds'] = data['roles'].map((item: any) => item.id)
        } else {
            if (formData.hasOwnProperty(key)) {
                formData[key] = data[key]
            }
        }
    }
}

const handleSubmit = async () => {
    formRef.value?.validate()
    await adminService.save(formData)
    popupRef.value?.close()
    feedback.success('操作成功')
    emit('success')
    // 刷新用户信息
    await userStore.getProfile()
}

const handleClose = () => {
    emit('close')
}

defineExpose({
    open,
    setFormData
})
</script>
