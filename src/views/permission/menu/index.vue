<template>
  <div class="menu-lists">
    <el-card
      class="!border-none"
      shadow="never"
    >
      <div>
        <el-button
          type="primary"
          @click="handleAdd()"
        >
          <template #icon>
            <icon name="el-icon-Plus" />
          </template>
          新增
        </el-button>
        <el-button @click="handleExpand">
          <template #icon>
            <icon :name="expand.icon" />
          </template>
          {{ expand.title }}
        </el-button>
      </div>
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="list"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        class="mt-4"
        row-key="id"
        size="large"
      >
        <el-table-column
          label="名称"
          min-width="150"
          prop="name"
          show-overflow-tooltip
        />
        <el-table-column
          label="类型"
          min-width="80"
          prop="type"
        >
          <template #default="{ row }">
            <div v-if="row.type === MenuEnum.CATALOGUE">
              目录
            </div>
            <div v-else-if="row.type === MenuEnum.MENU">
              菜单
            </div>
            <div v-else-if="row.type === MenuEnum.LINK">
              外链
            </div>
            <div v-else-if="row.type === MenuEnum.IFRAME">
              内嵌
            </div>
            <div v-else-if="row.type === MenuEnum.BUTTON">
              按钮
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="图标"
          min-width="80"
          prop="icon"
        >
          <template #default="{ row }">
            <div class="flex">
              <icon
                v-if="row.icon"
                :name="row.icon"
                :size="20"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="访问路径"
          min-width="150"
          prop="routePath"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ row.type === MenuEnum.LINK ? row.url : row.routePath }}
          </template>
        </el-table-column>
        <el-table-column
          label="权限标识"
          min-width="200"
          prop="perm"
        />

        <el-table-column
          label="显示"
          min-width="100"
          prop="isShow"
        >
          <template #default="{ row }">
            <el-tag v-if="row.isShow === 1">
              显示
            </el-tag>
            <el-tag
              v-else
              type="danger"
            >
              隐藏
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="状态"
          min-width="100"
          prop="isEnable"
        >
          <template #default="{ row }">
            <el-tag v-if="row.isEnable === 1">
              正常
            </el-tag>
            <el-tag
              v-else
              type="danger"
            >
              停用
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="排序"
          min-width="100"
          prop="sort"
        />

        <el-table-column
          fixed="right"
          label="操作"
          width="160"
        >
          <template #default="{ row }">
            <el-button
              v-if="row.type === MenuEnum.CATALOGUE || row.type === MenuEnum.MENU"
              link
              type="primary"
              @click="handleAdd(row.id)"
            >
              新增
            </el-button>
            <el-button
              v-if="row.type === MenuEnum.LINK"
              link
              type="primary"
              @click="handleView(row)"
            >
              访问
            </el-button>

            <el-button
              link
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <edit-popup
      v-if="showEdit"
      ref="editRef"
      @close="showEdit = false"
      @success="getAll"
    />
  </div>
</template>
<script lang="ts" setup>
import type { ElTable } from 'element-plus'

import { menuService } from '@/api/permission'
import { MenuEnum } from '@/enums/app'
import feedback from '@/utils/feedback'

import EditPopup from './edit.vue'

let isExpand = false

const tableRef = shallowRef<InstanceType<typeof ElTable>>()
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const loading = ref(false)
const showEdit = ref(false)
const list = ref([])
const expand = reactive({
    title: '展开',
    icon: 'el-icon-ArrowRight'
})

const getAll = async () => {
    loading.value = true
    try {
        const { data } = await menuService.getAll()
        list.value = data
        loading.value = false
    } catch (error) {
        loading.value = false
    }
}

const handleAdd = async (id?: number) => {
    showEdit.value = true
    await nextTick()
    if (id) {
        editRef.value?.setFormData({
            pid: id
        })
    }
    editRef.value?.handleOpen('add')
}

const handleView = async (row: any) => {
    window.open(row.type === MenuEnum.LINK ? row.url : row.path)
}

const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.handleOpen('edit')
    editRef.value?.setFormData(data)
}

const handleDelete = async (id: number) => {
    await feedback.confirm('确定要删除？', 'warning')
    await menuService.delete({ id })
    feedback.success('删除成功')
    await getAll()
}

const handleExpand = () => {
    isExpand = !isExpand
    isExpand ? (expand.title = '折叠') : (expand.title = '展开')
    isExpand ? (expand.icon = 'el-icon-ArrowDown') : (expand.icon = 'el-icon-ArrowRight')
    toggleExpand(list.value, isExpand)
}

const toggleExpand = (children: any[], unfold = true) => {
    for (const key in children) {
        tableRef.value?.toggleRowExpansion(children[key], unfold)
        if (children[key].children) {
            toggleExpand(children[key].children!, unfold)
        }
    }
}

getAll()
</script>
