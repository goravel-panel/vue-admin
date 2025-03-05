<template>
  <div class="role-lists">
    <el-card
      class="!border-none"
      shadow="never"
    >
      <el-form
        :model="queryParams"
        class="mb-[-16px]"
        inline
      >
        <el-form-item label="名称">
          <el-input
            v-model="queryParams.name"
            class="w-[250px]"
            clearable
            @keyup.enter="resetPage"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="queryParams.remark"
            class="w-[250px]"
            clearable
            @keyup.enter="resetPage"
          />
        </el-form-item>

        <el-form-item label="状态">
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
              label="启用"
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
      class="mt-4 !border-none"
      shadow="never"
    >
      <div>
        <el-button
          type="primary"
          @click="handleAdd"
        >
          <template #icon>
            <icon name="el-icon-Plus" />
          </template>
          新增
        </el-button>
      </div>
      <div class="mt-4">
        <div>
          <el-table
            v-loading="pager.loading"
            :data="pager.list"
            size="large"
          >
            <el-table-column
              label="名称"
              min-width="120"
              prop="name"
              sortable
            />
            <el-table-column
              label="备注"
              min-width="150"
              prop="remark"
              show-overflow-tooltip
            />
            <el-table-column
              label="成员数"
              min-width="100"
              prop="members.length"
              sortable
            />
            <el-table-column
              label="最近更新时间"
              min-width="180"
              prop="updatedAt"
              sortable
            />
            <el-table-column
              label="排序"
              min-width="100"
              prop="sort"
              sortable
            />
            <el-table-column
              label="状态"
              min-width="80"
            >
              <template #default="{ row }">
                <el-switch
                  v-model="row.isEnable"
                  :active-value="1"
                  :before-change="() => handleBeforeChange(row)"
                  :inactive-value="0"
                  active-text="启用"
                  inactive-text="禁用"
                  inline-prompt
                />
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              label="操作"
              width="190"
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
                  type="primary"
                  @click="handleAuth(row)"
                >
                  权限设置
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
        </div>
        <div class="flex justify-end mt-4">
          <pagination
            v-model="pager"
            @change="getList"
          />
        </div>
      </div>
    </el-card>
    <edit-popup
      v-if="showEdit"
      ref="editRef"
      @close="showEdit = false"
      @success="getList"
    />
    <auth-popup
      v-if="showAuth"
      ref="authRef"
      @close="showAuth = false"
      @success="getList"
    />
  </div>
</template>

<script lang="ts" setup>
import { roleService } from '@/api/permission'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'

import AuthPopup from './auth.vue'
import EditPopup from './edit.vue'

const showEdit = ref(false)
const showAuth = ref(false)
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const authRef = shallowRef<InstanceType<typeof AuthPopup>>()

const queryParams = reactive({
    name: '',
    remark: '',
    isEnable: 0
})

const { pager, getList, resetParams, resetPage } = usePaging({
    fetch: roleService.getList,
    params: queryParams
})

const handleAdd = async () => {
    showEdit.value = true
    await nextTick()
    editRef.value?.handleOpen('add')
}

const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.handleOpen('edit')
    editRef.value?.setFormData(data)
}

const handleBeforeChange = async (row: any): Promise<boolean> => {
    const isEnable = 1 - row.isEnable
    if (isEnable === 1) {
        await feedback.confirm('确定要启用该角色？', 'warning')
    } else {
        await feedback.confirm('确定要禁用该角色？', 'warning')
    }
    await roleService
        .setStatus({
            id: row.id,
            isEnable: isEnable
        })
        .then(() => {
            return true
        })
    await getList()
    return false
}

const handleAuth = async (data: any) => {
    showAuth.value = true
    await nextTick()
    authRef.value?.handleOpen()
    authRef.value?.setFormData(data)
}

// 删除角色
const handleDelete = async (id: number) => {
    await feedback.confirm('确定要删除？', 'warning')
    await roleService.delete({ id })
    await getList()
}

getList()
</script>
