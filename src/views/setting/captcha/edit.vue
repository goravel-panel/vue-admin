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
          验证码设置
        </div>

        <el-form-item
          label="验证码预览"
          prop="src"
        >
          <el-link
            :underline="false"
            @click="handleRefresh"
          >
            <el-image
              v-if="formData.src"
              :src="formData.src"
            />
          </el-link>
        </el-form-item>

        <el-form-item
          label="验证码类型"
          prop="type"
        >
          <el-radio-group
            v-model="formData.type"
            @change="handleChange"
          >
            <el-radio value="letter">
              纯字母
            </el-radio>
            <el-radio value="digit">
              纯数字
            </el-radio>
            <el-radio value="string">
              字符串(数字+字母)
            </el-radio>
            <el-radio value="math">
              数学运算
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="formData.type === 'letter'"
          label="验证码资源"
          prop="letterSource"
        >
          <div class="w-80">
            <el-input
              v-model="formData.letterSource"
              :disabled="true"
              type="textarea"
            />
          </div>
        </el-form-item>

        <el-form-item
          v-if="formData.type === 'digit'"
          label="验证码资源"
          prop="digitSource"
        >
          <div class="w-80">
            <el-input
              v-model="formData.digitSource"
              :disabled="true"
              type="textarea"
            />
          </div>
        </el-form-item>

        <el-form-item
          v-if="formData.type === 'string'"
          label="验证码资源"
          prop="stringSource"
        >
          <div class="w-80">
            <el-input
              v-model="formData.stringSource"
              :disabled="true"
              type="textarea"
            />
          </div>
        </el-form-item>

        <el-form-item
          v-if="formData.type !== 'math'"
          label="验证码位数"
          prop="length"
        >
          <div class="w-80">
            <el-input-number
              v-model="formData.length"
              :max="6"
              :min="4"
              @change="handleChange"
            />
          </div>
        </el-form-item>

        <el-form-item
          label="背景干扰度"
          prop="noiseCount"
        >
          <div class="w-80 ml-2">
            <el-slider
              v-model="formData.noiseCount"
              :max="10"
              :min="0"
              :show-tooltip="true"
              :step="1"
              size="small"
              @change="handleChange"
            />
          </div>
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

import { captchaService } from '@/api/setting'
import feedback from '@/utils/feedback'

const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
    id: 0,
    src: '',
    length: 4,
    height: 32,
    width: 100,
    type: '',
    noiseCount: 0,
    letterSource: '',
    digitSource: '',
    stringSource: ''
})

// 表单验证
const formRules = reactive<FormRules<typeof formData>>({
    src: [
        {
            required: true,
            message: '验证码图片不能为空',
            trigger: ['blur']
        }
    ],
    type: [
        {
            required: true,
            message: '请选择验证码类型',
            trigger: ['blur']
        }
    ],
    letterSource: [
        {
            required: true,
            trigger: ['blur']
        }
    ],
    digitSource: [
        {
            required: true,
            trigger: ['blur']
        }
    ],
    stringSource: [
        {
            required: true,
            trigger: ['blur']
        }
    ],
    length: [
        {
            required: true,
            message: '请输入验证码位数',
            trigger: ['blur']
        }
    ],
    noiseCount: [
        {
            required: true,
            message: '请选择背景干扰度',
            trigger: ['change']
        }
    ]
})

const getCaptcha = async () => {
    const { data } = await captchaService.generate({
        type: formData.type,
        length: formData.length,
        width: formData.width,
        height: formData.height,
        noiseCount: formData.noiseCount
    })
    formData.src = data.src
}

const setFormData = async () => {
    const { data } = await captchaService.getDetail()
    for (const key in formData) {
        if (key !== 'src' && formData.hasOwnProperty(key)) {
            data[key] && (formData[key] = data[key])
        }
    }
}

const handleRefresh = async () => {
    await getCaptcha()
}

const handleChange = async () => {
    await getCaptcha()
}

const handleSubmit = async () => {
    await formRef.value?.validate()
    await captchaService.save(formData)
    feedback.success('操作成功')
}

setFormData()
getCaptcha()
</script>
