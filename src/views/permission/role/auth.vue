<template>
  <div class="edit-popup">
    <popup
      ref="popupRef"
      :async="true"
      title="权限设置"
      width="550px"
      @close="handleClose"
      @confirm="handleSubmit"
    >
      <el-form
        ref="formRef"
        :model="formData"
        class="ls-form"
        label-width="60px"
      >
        <el-scrollbar class="h-[400px] sm:h-[400px]">
          <el-form-item
            label="权限"
            prop="menus"
          >
            <div>
              <el-checkbox
                label="展开/折叠"
                @change="handleExpand"
              />
              <el-checkbox
                label="全选/不全选"
                @change="handleSelectAll"
              />
              <el-checkbox
                v-if="false"
                v-model="checkStrictly"
                label="父子联动"
              />
              <div>
                <el-tree
                  ref="treeRef"
                  :check-strictly="!checkStrictly"
                  :data="menuTree"
                  :default-expand-all="isExpand"
                  :props="{
                    label: 'name',
                    children: 'children'
                  }"
                  node-key="id"
                  show-checkbox
                />
              </div>
            </div>
          </el-form-item>
        </el-scrollbar>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type { CheckboxValueType, ElTree, FormInstance } from 'element-plus'

import { menuService, roleService } from '@/api/permission'
import Popup from '@/components/popup/index.vue'
import useUserStore from '@/stores/modules/user'
import feedback from '@/utils/feedback'
import { treeToArray } from '@/utils/util'

const userStore = useUserStore()
const isExpand = ref(false)
const checkStrictly = ref(true)
const menuArray = ref<any[]>([])
const menuTree = ref<any[]>([])
const emit = defineEmits(['success', 'close'])
const treeRef = shallowRef<InstanceType<typeof ElTree>>()
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()

// 表单数据
const formData = reactive({
    id: '',
    menuIds: [] as any[]
})

const getOptions = async () => {
    const { data } = await menuService.getAll()
    menuTree.value = data
    menuArray.value = treeToArray(data)
}

// 获取所有选择的节点包括半选中节点
const getDeptAllCheckedKeys = () => {
    const checkedKeys = treeRef.value?.getCheckedKeys()
    const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys()!
    checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys)
    return checkedKeys
}

const setDeptAllCheckedKeys = () => {
    formData.menuIds.forEach((v) => {
        nextTick(() => {
            treeRef.value?.setChecked(v, true, false)
        })
    })
}

const handleExpand = (check: CheckboxValueType) => {
    const treeList = menuTree.value
    for (let i = 0; i < treeList.length; i++) {
        //@ts-ignore
        treeRef.value.store.nodesMap[treeList[i].id].expanded = check
    }
}

const handleSelectAll = (check: CheckboxValueType) => {
    if (check) {
        treeRef.value?.setCheckedKeys(menuArray.value.map((item) => item.id))
    } else {
        treeRef.value?.setCheckedKeys([])
    }
}

const handleClose = () => {
    emit('close')
}

const handleOpen = () => {
    popupRef.value?.open()
}

const setFormData = async (row: Record<any, any>) => {
    await getOptions()
    const { data } = await roleService.getDetail({
        id: row.id
    })
    formData['id'] = data['id']
    formData['menuIds'] = data['menus'].map((item: any) => item.id)
    await nextTick(() => {
        setDeptAllCheckedKeys()
    })
}

const handleSubmit = async () => {
    formRef.value?.validate()
    formData.menuIds = getDeptAllCheckedKeys()!
    await roleService.setAuth(formData)
    popupRef.value?.close()
    feedback.success('操作成功')
    emit('success')
    // 刷新菜单
    await userStore.getProfile()
}

defineExpose({
    handleOpen,
    setFormData
})
</script>
