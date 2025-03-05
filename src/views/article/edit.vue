<template>
  <div class="article-edit">
    <el-card
      class="!border-none"
      shadow="never"
    >
      <el-page-header
        :content="$route.meta.title"
        @back="$router.back()"
      />
    </el-card>
    <el-card
      class="mt-4 !border-none"
      shadow="never"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        class="ls-form"
        label-width="85px"
      >
        <el-form-item
          label="文章分类"
          prop="categoryID"
        >
          <el-select
            v-model="formData.categoryID"
            class="!w-[800px]"
            clearable
            placeholder="请选择文章分类"
          >
            <el-option
              v-for="(item, index) in options.categories"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="文章标题"
          prop="title"
        >
          <el-input
            v-model="formData.title"
            class="w-[800px]"
            clearable
            maxlength="250"
            placeholder="请输入文章标题"
            show-word-limit
          />
        </el-form-item>

        <el-form-item
          label="文章来源"
          prop="from"
        >
          <el-input
            v-model="formData.from"
            class="w-[800px]"
            clearable
            maxlength="20"
            placeholder=""
            show-word-limit
          />
        </el-form-item>

        <el-form-item
          label="新闻封面"
          prop="cover"
        >
          <div>
            <div>
              <attach-picker
                v-model="formData.cover"
                :limit="1"
              />
            </div>
            <div class="form-tips">
              建议尺寸：240*180px
            </div>
          </div>
        </el-form-item>

        <el-form-item
          label="文章详情"
          prop="content"
        >
          <editor
            v-model="formData.content"
            :height="600"
            :width="800"
          />
        </el-form-item>

        <el-form-item
          label="文章状态"
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
    </el-card>
    <footer-button>
      <el-button
        type="primary"
        @click="handleSave"
      >
        保存
      </el-button>
      <el-button
        type="warning"
        @click="router.go(-1)"
      >
        返回
      </el-button>
    </footer-button>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { articleService, categoryService } from '@/api/article'
import { useOptions } from '@/hooks/useOptions'

const route = useRoute()
const router = useRouter()
const formRef = shallowRef<FormInstance>()

const formData = reactive({
    id: 0,
    categoryID: '',
    title: '',
    from: '',
    cover: '',
    content: '',
    isEnable: 1
})

const formRules = reactive<FormRules<typeof formData>>({
    title: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
    from: [{ required: true, message: '请输入新闻来源', trigger: 'blur' }],
    cover: [{ required: true, message: '请上传新闻封面', trigger: 'blur' }],
    categoryID: [{ required: true, message: '请选择分类', trigger: 'change' }],
    content: [{ required: true, message: '文章详情不能为空', trigger: 'blur' }]
})

const setFormData = async () => {
    const { data } = await articleService.getDetail({
        id: route.query.id
    })
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            formData[key] = data[key]
        }
    }
}

const handleSave = async () => {
    await formRef.value?.validate()
    await articleService.save(formData)
    router.back()
}

const { options } = useOptions<{
    categories: any[]
}>({
    categories: {
        fetch: categoryService.getAll
    }
})

route.query.id && setFormData()
</script>
