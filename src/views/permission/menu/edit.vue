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
        label-width="80px"
      >
        <el-form-item
          label="菜单类型"
          prop="type"
          required
        >
          <el-radio-group v-model="formData.type">
            <el-radio :value="MenuEnum.CATALOGUE">
              目录
            </el-radio>
            <el-radio :value="MenuEnum.MENU">
              菜单
            </el-radio>
            <el-radio :value="MenuEnum.BUTTON">
              按钮
            </el-radio>
            <el-radio :value="MenuEnum.LINK">
              外链
            </el-radio>
            <el-radio :value="MenuEnum.IFRAME">
              内嵌
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="父级菜单"
          prop="pid"
        >
          <el-tree-select
            v-model="formData.pid"
            :data="menuOptions"
            :default-expand-all="true"
            :props="{
              label: 'name'
            }"
            check-strictly
            class="flex-1"
            clearable
            node-key="id"
            placeholder="请选择父级菜单"
            @node-click="handleNodeClick"
          />
        </el-form-item>

        <el-form-item
          label="菜单名称"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            clearable
            placeholder="请输入菜单名称"
          />
        </el-form-item>

        <el-form-item
          v-if="formData.type !== MenuEnum.BUTTON"
          label="菜单图标"
          prop="icon"
        >
          <icon-picker
            v-model="formData.icon"
            class="flex-1"
          />
        </el-form-item>

        <el-form-item
          v-if="formData.type !== MenuEnum.BUTTON && formData.type !== MenuEnum.LINK"
          label="访问路径"
          prop="routePath"
        >
          <div class="flex-1">
            <el-input
              v-model="formData.routePath"
              clearable
              placeholder="请输入路由路径"
            />
          </div>
        </el-form-item>

        <el-form-item
          v-if="formData.type === MenuEnum.LINK"
          label="外链地址"
          prop="url"
        >
          <div class="flex-1">
            <el-input
              v-model="formData.url"
              clearable
              placeholder="请输入外链地址"
            />
            <div class="form-tips">
              外链地址以 `http(s)://` 开头
            </div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="formData.type === MenuEnum.IFRAME"
          label="内嵌地址"
          prop="url"
        >
          <div class="flex-1">
            <el-input
              v-model="formData.url"
              clearable
              placeholder="请输入内嵌地址"
            />
            <div class="form-tips">
              内嵌地址以 `http(s)://` 开头
            </div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="formData.type === MenuEnum.MENU"
          label="组件路径"
          prop="component"
        >
          <div class="flex-1">
            <el-autocomplete
              v-model="formData.component"
              :fetch-suggestions="querySearch"
              class="w-full"
              clearable
              placeholder="请输入组件路径"
            />
            <div class="form-tips">
              访问的组件路径，如 `permission/admin/index`，默认在 `views` 目录下
            </div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="formData.type !== MenuEnum.CATALOGUE && formData.type !== MenuEnum.LINK"
          label="权限标识"
          prop="perm"
        >
          <div class="flex-1">
            <el-input
              v-model="formData.perm"
              clearable
              placeholder="请输入唯一权限标识"
            />
            <div class="form-tips">
              用于页面权限控制，如 v-perms='article.list'，请谨慎修改
            </div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="formData.type === MenuEnum.MENU"
          label="选中菜单"
          prop="selected"
        >
          <div class="flex-1">
            <el-input
              v-model="formData.selectedPath"
              clearable
              placeholder="请输入高亮菜单的路由路径"
            />
            <div class="form-tips">
              访问详情页面，编辑页面时，菜单高亮显示，如 `consumer/lists`
            </div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="formData.type === MenuEnum.MENU"
          label="路由参数"
          prop="params"
        >
          <div class="flex-1">
            <el-input
              v-model="formData.param"
              clearable
              placeholder="请输入路由参数"
            />
            <div class="form-tips">
              访问路由的默认传递参数，如 `{"type": 1, "name": "admin"}`
            </div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="formData.type !== MenuEnum.BUTTON"
          label="是否显示"
          prop="isShow"
        >
          <div class="flex-1">
            <el-switch
              v-model="formData.isShow"
              :active-value="1"
              :inactive-value="-1"
            />
            <span class="ml-2">{{ formData.isShow === 1 ? '显示' : '隐藏' }}</span>
            <div class="form-tips">
              选择隐藏则菜单不会出现在侧边栏，但仍然可以访问
            </div>
          </div>
        </el-form-item>

        <el-form-item
          label="菜单状态"
          prop="isEnable"
        >
          <div class="flex-1">
            <el-switch
              v-model="formData.isEnable"
              :active-value="1"
              :inactive-value="-1"
            />
            <span class="ml-2">{{ formData.isEnable === 1 ? '正常' : '停用' }}</span>
            <div class="form-tips">
              选择停用则菜单不会出现在侧边栏，也不能被访问
            </div>
          </div>
        </el-form-item>

        <el-form-item
          label="菜单排序"
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
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { menuService } from '@/api/permission'
import Popup from '@/components/popup/index.vue'
import { MenuEnum } from '@/enums/app'
import { getModulesKey } from '@/router'
import useUserStore from '@/stores/modules/user'
import feedback from '@/utils/feedback'
import { arrayToTree, treeToArray } from '@/utils/util'

const mode = ref('add')
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const componentsOptions = ref(getModulesKey())
const userStore = useUserStore()

const popupTitle = computed(() => {
    return mode.value === 'edit' ? '编辑菜单' : '新增菜单'
})

const querySearch = (queryString: string, cb: any) => {
    const results = queryString
        ? componentsOptions.value.filter((item) =>
            item.toLowerCase().includes(queryString.toLowerCase())
        )
        : componentsOptions.value
    cb(results.map((item) => ({ value: item })))
}

// 表单数据
const formData = reactive({
    id: 0,
    // 父级id
    pid: 0,
    // 类型
    type: MenuEnum.CATALOGUE,
    // 图标
    icon: '',
    // 名称
    name: '',
    // 排序字段
    sort: 0,
    // 路由路径
    routePath: '',
    // 链接地址
    url: '',
    // 权限标识
    perm: '',
    // 前端组件
    component: '',
    // 选中路径
    selectedPath: '',
    // 路由参数
    param: '',
    // 是否缓存 -1=否， 1=是
    isCache: -1,
    // 是否显示 -1=否， 1=是
    isShow: 1,
    // 是否启用 -1=否， 1=是
    isEnable: 1
})

// 表单验证
const formRules = reactive<FormRules<typeof formData>>({
    pid: [
        {
            required: true,
            message: '请选择父级菜单',
            trigger: ['blur', 'change']
        }
    ],
    name: [
        {
            required: true,
            message: '请输入菜单名称',
            trigger: 'blur'
        }
    ],
    routePath: [
        {
            required: true,
            message: '请输入路由地址',
            trigger: 'blur'
        }
    ],
    url: [
        {
            required: true,
            message: '请输入链接地址',
            trigger: 'blur'
        }
    ],
    component: [
        {
            required: true,
            message: '请输入组件地址',
            trigger: 'blur'
        }
    ]
})

const handleNodeClick = (row: any) => {
    formData.pid = row.pid
}

const menuOptions = ref<any[]>([])
const getAll = async () => {
    const { data } = await menuService.getAll()
    const menu: any = { id: 0, name: '顶级', children: [] }
    menu.children = arrayToTree(
        treeToArray(data).filter(
            (item) =>
                item.type !== MenuEnum.BUTTON &&
                item.type !== MenuEnum.LINK &&
                item.type !== MenuEnum.IFRAME
        )
    )
    menuOptions.value.push(menu)
}

const handleSubmit = async () => {
    formRef.value?.validate()
    await menuService.save(formData)
    popupRef.value?.close()
    feedback.success('操作成功')
    emit('success')
    // 刷新菜单
    await userStore.getProfile()
}

const handleOpen = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

const setFormData = async (row: Record<any, any>) => {
    const { data } = await menuService.getDetail({
        id: row.id
    })
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            formData[key] = data[key]
        }
    }
    if (formData.type === MenuEnum.BUTTON) {
        formData.isShow = 0
    }
}

const handleClose = () => {
    emit('close')
}

getAll()

defineExpose({
    handleOpen,
    setFormData
})
</script>
