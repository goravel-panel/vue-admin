<template>
  <div class="admin">
    <el-card
      class="!border-none"
      shadow="never"
    >
      <el-form
        :model="queryParams"
        class="mb-[-16px]"
        inline
      >
        <el-form-item label="账号">
          <el-input
            v-model="queryParams.account"
            class="w-[250px]"
            clearable
            @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="queryParams.roleId"
            class="!w-[250px]"
            clearable
            placeholder=""
          >
            <el-option
              :value="0"
              label="不限"
            />
            <el-option
              v-for="(item, index) in options.roles"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
      <el-button
        type="primary"
        @click="handleAdd"
      >
        <template #icon>
          <icon name="el-icon-Plus" />
        </template>
        新增
      </el-button>
      <div class="mt-4">
        <el-table
          v-loading="pager.loading"
          :data="pager.list"
          size="large"
        >
          <el-table-column
            label="ID"
            min-width="60"
            prop="id"
          />
          <el-table-column
            label="头像"
            min-width="100"
          >
            <template #default="{ row }">
              <el-avatar
                :size="50"
                :src="row.avatar"
              >
                {{ row.name.charAt(0) }}
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column
            label="账号"
            min-width="100"
            prop="account"
          />
          <el-table-column
            label="名称"
            min-width="120"
            prop="name"
          />
          <el-table-column
            label="创建时间"
            min-width="180"
            prop="createdAt"
          />
          <el-table-column
            label="最近登录时间"
            min-width="180"
            prop="lastLoginTime"
          />
          <el-table-column
            label="最近登录IP"
            min-width="120"
            prop="lastLoginIP"
          />

          <el-table-column
            label="用户状态"
            min-width="100"
          >
            <template #default="{ row }">
              <el-switch
                v-model="row.isEnable"
                :active-value="1"
                :before-change="() => handleBeforeChange(row)"
                :disabled="row.isRoot === 1"
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
            width="120"
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
                :disabled="row.isRoot === 1"
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
      <div class="flex mt-4 justify-end">
        <pagination
          v-model="pager"
          @change="getList"
        />
      </div>
    </el-card>
    <edit-popup
      v-if="showEdit"
      ref="editRef"
      @close="showEdit = false"
      @success="getList"
    />
  </div>
</template>

<script lang="ts" setup>
import { adminService, roleService } from '@/api/permission'
import { useOptions } from '@/hooks/useOptions'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'

import EditPopup from './edit.vue'

const showEdit = ref(false)
const editRef = shallowRef<InstanceType<typeof EditPopup>>()

const queryParams = reactive({
    account: '',
    name: '',
    roleId: 0,
    isEnable: 0
})

const { pager, getList, resetParams, resetPage } = usePaging({
    fetch: adminService.getList,
    params: queryParams
})

const { options } = useOptions<{
    roles: any[]
}>({
    roles: {
        fetch: roleService.getAll
    }
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

const handleBeforeChange = async (row: any): Promise<boolean> => {
    const isEnable = 1 - row.isEnable
    if (isEnable === 1) {
        await feedback.confirm('确定要启用该用户？', 'warning')
    } else {
        await feedback.confirm('确定要禁用该用户？', 'warning')
    }

    await adminService
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

const handleDelete = async (id: number) => {
    await feedback.confirm('确定要删除？', 'warning')
    await adminService.delete({ id })
    feedback.success('删除成功')
    await getList()
}

onMounted(() => {
    getList()
})
</script>
