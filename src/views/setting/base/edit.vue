<!-- 网站信息 -->
<template>
  <div class="website-information">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-position="left"
      label-width="auto"
    >
      <el-card
        class="!border-none"
        shadow="never"
      >
        <div class="text-xl font-medium mb-[20px]">
          后台设置
        </div>

        <el-form-item
          label="系统名称"
          prop="name"
        >
          <div class="w-80">
            <el-input
              v-model="formData.name"
              clearable
              placeholder="请输入系统名称"
            />
          </div>
        </el-form-item>

        <el-form-item
          label="系统图标"
          prop="logo"
        >
          <div class="w-[100%]">
            <attach-picker
              v-model="formData.logo"
              :limit="1"
              height="100px"
              width="100px"
            />
          </div>
          <div class="form-tips">
            系统 logo，建议尺寸：50*50px
          </div>
        </el-form-item>

        <el-form-item
          label="登录背景"
          prop="loginBackground"
        >
          <div class="w-[100%]">
            <attach-picker
              v-model="formData.loginBackground"
              :limit="1"
              height="100px"
              width="100px"
            />
          </div>
          <div class="form-tips">
            登录页左侧图片，建议使用透明png格式图片，尺寸：800*625px
          </div>
        </el-form-item>

        <el-form-item
          label="系统邮箱"
          prop="email"
        >
          <div class="w-80">
            <el-input
              v-model="formData.email"
              clearable
              placeholder="请输入系统邮箱"
            />
          </div>
        </el-form-item>

        <el-form-item
          label="版权信息"
          prop="copyright"
        >
          <div class="w-80">
            <el-input
              v-model="formData.copyright"
              :rows="2"
              placeholder="请输入版权信息，支持 html"
              type="textarea"
            />
          </div>
        </el-form-item>

        <el-form-item
          label="登录验证码"
          prop="useLoginCaptcha"
        >
          <el-switch
            v-model="formData.useLoginCaptcha"
            :active-value="true"
            :inactive-value="false"
          />
          <span class="ml-2">{{ formData.useLoginCaptcha ? '开启' : '关闭' }}</span>
        </el-form-item>
      </el-card>
    </el-form>
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
import { reactive } from 'vue'

import { baseService } from '@/api/setting'
import useAppStore from '@/stores/modules/app'
import feedback from '@/utils/feedback'

const appStore = useAppStore()
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
    name: '',
    logo: '',
    email: '',
    copyright: '',
    loginBackground: '',
    useLoginCaptcha: true
})

// 表单验证
const formRules = reactive<FormRules<typeof formData>>({
    name: [
        {
            required: true,
            message: '请输入系统名称',
            trigger: ['blur']
        }
    ],
    logo: [
        {
            required: true,
            message: '请上传系统logo',
            trigger: ['change']
        }
    ],
    email: [
        {
            required: true,
            message: '请输入系统邮箱',
            trigger: ['blur']
        },
        {
            type: 'email',
            message: '请输入合法邮箱地址',
            trigger: ['blur']
        }
    ],
    copyright: [
        {
            required: true,
            message: '请输入版权信息',
            trigger: ['blur']
        }
    ],
    useLoginCaptcha: [
        {
            required: true,
            message: '请选择是否开启验证码',
            trigger: ['blur']
        }
    ]
})

const setFormData = async () => {
    const { data } = await baseService.getDetail()
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            formData[key] = data[key]
        }
    }
}

const handleSubmit = async () => {
    await formRef.value?.validate()
    await baseService.save(formData)
    feedback.success('操作成功')
    await appStore.getConfig()
}

setFormData()
</script>
