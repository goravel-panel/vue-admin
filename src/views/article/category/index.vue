<template>
  <div>
    <el-card
      class="!border-none"
      shadow="never"
    >
      <el-form
        :inline="true"
        :model="queryParams"
        class="mb-[-16px]"
      >
        <el-form-item label="分类名称">
          <el-input
            v-model="queryParams.name"
            class="w-[280px]"
            clearable
            placeholder="支持模糊查询"
            @keyup.enter="resetPage"
          />
        </el-form-item>

        <el-form-item label="显示状态">
          <el-select
            v-model="queryParams.isEnable"
            class="!w-[250px]"
          >
            <el-option
              :value="-1"
              label="不限"
            />
            <el-option
              :value="1"
              label="正常"
            />
            <el-option
              :value="0"
              label="禁用"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="resetPage"
          >
            查询
          </el-button>
          <el-button @click="resetParams">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card
      class="!border-none mt-4"
      shadow="never"
    >
      <div class="flex">
        <el-button
          type="primary"
          @click="handleAdd"
        >
          <template #icon>
            <icon name="el-icon-Plus" />
          </template>
          添加
        </el-button>
      </div>
      <div class="mt-4">
        <el-table
          v-loading="pager.loading"
          :data="pager.list"
          height="600"
          size="large"
          style="width: 100%"
        >
          <el-table-column
            label="分类名称"
            min-width="120"
            prop="name"
            sortable
          />
          <el-table-column
            label="展示顺序"
            min-width="100"
            prop="sort"
            sortable
          />
          <el-table-column
            label="文章数量"
            min-width="100"
            prop="articleCount"
            sortable
          />
          <el-table-column
            label="添加时间"
            min-width="180"
            prop="createdAt"
            sortable
          />
          <el-table-column
            label="最近更新时间"
            min-width="180"
            prop="updatedAt"
            sortable
          />

          <el-table-column
            label="分类状态"
            min-width="100"
          >
            <template #default="{ row }">
              <el-tag
                v-if="row.isEnable === 1"
                type="success"
              >
                正常
              </el-tag>
              <el-tag
                v-else
                type="danger"
              >
                禁用
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            min-width="100"
          >
            <template #default="{ row }">
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
        <div class="flex justify-end mt-4">
          <pagination
            v-model="pager"
            @change="getList"
          />
        </div>
      </div>
    </el-card>

    <edit-popup
      ref="editRef"
      @success="getList"
    />
  </div>
</template>
<script lang="ts" setup>
import { categoryService } from '@/api/article'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'

import EditPopup from './edit.vue'

const showEdit = ref(false)
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const queryParams = reactive({
    name: '',
    isEnable: -1
})

const handleAdd = async () => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('add')
}

const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('edit')
    editRef.value?.setFormData(data)
}

const handleDelete = async (id: number) => {
    await feedback.confirm('确定要删除？', 'warning')
    await categoryService.delete({ id })
    await getList()
}

const { pager, getList, resetPage, resetParams } = usePaging({
    fetch: categoryService.getList,
    params: queryParams
})

getList()
</script>
