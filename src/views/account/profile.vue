<!-- 个人资料 -->
<template>
  <div class="user-setting">
    <el-card
      class="!border-none"
      shadow="never"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        class="ls-form"
        label-position="left"
        label-width="auto"
      >
        <el-form-item
          label="用户头像"
          prop="avatar"
        >
          <div class="w-[100%]">
            <attach-picker
              v-model="formData.avatar"
              :limit="1"
            />
          </div>
          <div class="form-tips">
            建议尺寸：50*50px
          </div>
        </el-form-item>

        <el-form-item
          label="登录账号："
          prop="account"
        >
          <div class="w-80">
            <el-input
              v-model="formData.account"
              clearable
            />
          </div>
        </el-form-item>

        <el-form-item
          label="用户昵称："
          prop="name"
        >
          <div class="w-80">
            <el-input
              v-model="formData.name"
              clearable
              placeholder="请输入名称"
            />
          </div>
        </el-form-item>

        <el-form-item
          label="原始密码："
          prop="oldPassword"
        >
          <div class="w-80">
            <el-input
              v-model.trim="formData.oldPassword"
              autocomplete="new-password"
              oncopy="return false"
              placeholder="修改密码时必填, 不修改密码时留空"
              show-password
              type="password"
            />
          </div>
        </el-form-item>

        <el-form-item
          label="新的密码："
          prop="newPassword"
        >
          <div class="w-80">
            <el-input
              v-model.trim="formData.newPassword"
              placeholder="修改密码时必填, 不修改密码时留空"
              show-password
              type="password"
            />
          </div>
        </el-form-item>

        <el-form-item
          label="确定密码："
          prop="confirmPassword"
        >
          <div class="w-80">
            <el-input
              v-model.trim="formData.confirmPassword"
              placeholder="修改密码时必填, 不修改密码时留空"
              show-password
              type="password"
            />
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <footer-button>
      <el-button
        type="primary"
        @click="handleSubmit"
      >
        保存
      </el-button>
    </footer-button>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { accountService } from '@/api/account'
import useUserStore from '@/stores/modules/user'
import feedback from '@/utils/feedback'
import token from '@/utils/token'

const formRef = ref<FormInstance>()
const userStore = useUserStore()

// 表单数据
const formData = reactive({
    avatar: '', // 用户头像
    account: '', // 登录账号
    name: '', // 用户昵称
    oldPassword: '', // 原始密码
    newPassword: '', // 新的密码
    confirmPassword: '' // 确定密码
})

// 表单验证
const formRules = reactive<FormRules<typeof formData>>({
    avatar: [
        {
            required: true,
            message: '用户头像不能为空',
            trigger: ['change']
        }
    ],
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
            message: '请输入用户昵称',
            trigger: ['blur']
        }
    ],
    oldPassword: [
        {
            validator: (_: object, value: string, callback: any) => {
                if (formData.oldPassword) {
                    if (value.length < 6) callback(new Error('原始密码长度不能低于6'))
                }
                if (formData.newPassword) {
                    if (!value) callback(new Error('请输入原始密码'))
                }
                callback()
            },
            trigger: 'blur'
        }
    ],
    newPassword: [
        {
            validator: (_: object, value: string, callback: any) => {
                if (formData.oldPassword) {
                    if (!value) callback(new Error('请输入新的密码'))
                }
                callback()
            },
            trigger: 'blur'
        }
    ],
    confirmPassword: [
        {
            validator: (_: object, value: string, callback: any) => {
                if (formData.newPassword) {
                    if (!value) callback(new Error('请再次输入密码'))
                    if (value !== formData.newPassword) callback(new Error('两次输入密码不一致!'))
                }
                callback()
            },
            trigger: 'blur'
        }
    ]
})

const setFormData = async () => {
    const profile = userStore.profile
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            formData[key] = profile[key]
        }
    }
}

// 提交数据
const handleSubmit = async () => {
    await formRef.value?.validate()
    await accountService.setProfile(formData).then((res) => {
        feedback.success(res.message)
    })
    await userStore.getProfile()
    if (formData.confirmPassword?.length > 0) {
        setTimeout(() => {
            token.clear()
        }, 2000)
    }
}

setFormData()
</script>

<style lang="scss" scoped></style>
