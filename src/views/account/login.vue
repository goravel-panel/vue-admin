<template>
  <div class="login-box flex flex-col">
    <div class="flex-1 flex items-center justify-center">
      <div class="login-card flex rounded-md overflow-hidden">
        <div class="flex-1 h-full hidden md:inline-block">
          <image-contain
            :src="config.loginBackground ? config.loginBackground : loginBackground"
            :width="400"
            alt="Login Background"
            height="100%"
          />
        </div>
        <div
          class="login-form bg-body flex flex-col justify-center px-10 py-10 md:w-[400px] w-[375px] flex-none mx-auto"
        >
          <div class="text-center text-3xl font-medium mb-8">
            {{ config.name }}
          </div>
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            size="large"
          >
            <el-form-item prop="account">
              <el-input
                v-model="formData.account"
                :prefix-icon="User"
                clearable
                placeholder="请输入登录账号"
                @keyup.enter="handleEnter"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                ref="passwordRef"
                v-model="formData.password"
                :prefix-icon="Key"
                autocomplete="new-password"
                placeholder="请输入登录密码"
                show-password
                @keyup.enter="handleLogin"
              />
            </el-form-item>

            <el-form-item
              v-if="config.useLoginCaptcha === true"
              prop="captchaValue"
            >
              <div class="flex">
                <div
                  class="flexItem"
                  style="width: 210px"
                >
                  <el-input
                    v-model="formData.captchaValue"
                    :prefix-icon="Lock"
                    clearable
                    placeholder="请输入验证码"
                  />
                </div>
                <div
                  class="captchaPanel"
                  style="float: right"
                >
                  <el-link
                    :underline="false"
                    @click="getCaptcha"
                  >
                    <el-image
                      v-if="captchaSrc"
                      :src="captchaSrc"
                      class="ml-2"
                    />
                  </el-link>
                </div>
              </div>
            </el-form-item>
          </el-form>
          <div class="mb-5">
            <el-checkbox
              v-model="remAccount"
              label="记住账号"
            />
          </div>
          <el-button
            :loading="isLock"
            size="large"
            type="primary"
            @click="lockLogin"
          >
            登录
          </el-button>
        </div>
      </div>
    </div>
    <layout-footer />
  </div>
</template>

<script lang="ts" setup>
import { Key, Lock, User } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, InputInstance } from 'element-plus'
import { computed, onMounted, reactive, ref, shallowRef } from 'vue'

import { captchaService } from '@/api/setting'
import ImageContain from '@/components/image-contain/index.vue'
import { KeyEnum } from '@/enums/cache'
import { PageEnum } from '@/enums/page'
import { useLockFn } from '@/hooks/useLockFn'
import LayoutFooter from '@/layout/components/footer.vue'
import useAppStore from '@/stores/modules/app'
import useUserStore from '@/stores/modules/user'
import cache from '@/utils/cache'

import loginBackground from './images/login_background.png'

const passwordRef = shallowRef<InputInstance>()
const formRef = shallowRef<FormInstance>()
const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const remAccount = ref(false)
const config = computed(() => appStore.config)
const captchaSrc = ref('')

// 表单数据
const formData = reactive({
    account: '',
    password: '',
    captchaID: '',
    captchaValue: ''
})

// 表单验证
const formRules = reactive<FormRules<typeof formData>>({
    account: [
        {
            required: true,
            message: '请输入登录账号',
            trigger: ['blur']
        }
    ],
    password: [
        {
            required: true,
            message: '请输入登录密码',
            trigger: ['blur']
        }
    ],
    captchaValue: [
        {
            required: true,
            message: '请输入验证码',
            trigger: ['blur']
        }
    ]
})

const getCaptcha = async () => {
    const res = await captchaService.generate({
        width: 100,
        height: 40
    })
    captchaSrc.value = res.data.src
    formData.captchaID = res.data.id
}

// 回车按键监听
const handleEnter = () => {
    if (!formData.password) {
        return passwordRef.value?.focus()
    }
    handleLogin()
}

// 登录处理
const handleLogin = async () => {
    await formRef.value?.validate()
    // 记住账号，缓存
    cache.set(KeyEnum.ACCOUNT, {
        remember: remAccount.value,
        account: remAccount.value ? formData.account : ''
    })

    await userStore
        .login(formData)
        .then()
        .catch(() => {
            // 刷新验证码
            getCaptcha()
            return
        })

    const {
        query: { redirect }
    } = route
    const path = typeof redirect === 'string' ? redirect : PageEnum.INDEX
    await router.push(path)
}

const { isLock, lockFn: lockLogin } = useLockFn(handleLogin)

onMounted(() => {
    const value = cache.get(KeyEnum.ACCOUNT)
    if (value?.remember) {
        remAccount.value = value.remember
        formData.account = value.account
    }
})

getCaptcha()
</script>

<style lang="scss" scoped>
.login-box {
    background-image: url('./images/login_bg.png');
    @apply min-h-screen bg-no-repeat bg-center bg-cover;

    .login-card {
        height: 400px;
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        background-color: var(--g-container-bg);
        border-radius: 10px;
        box-shadow: var(--el-box-shadow);
        transform: translate(-50%) translateY(-50%);
    }

    .captchaPanel {
        width: 110px;
        padding-left: 10px;
    }

    .captchaPanel .el-button {
        width: 100px;
    }
}
</style>
