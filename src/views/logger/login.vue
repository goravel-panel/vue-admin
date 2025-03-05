<template>
  <div>
    <el-card
      class="!border-none"
      shadow="never"
    >
      <el-form
        ref="formRef"
        :inline="true"
        :model="queryParams"
        class="mb-[-16px]"
      >
        <el-form-item label="登录账号">
          <el-input
            v-model="queryParams.account"
            class="w-[250px]"
            clearable
            @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="登录IP">
          <el-input
            v-model="queryParams.ip"
            class="w-[250px]"
            clearable
            @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="登录状态">
          <el-select
            v-model="queryParams.status"
            class="!w-[250px]"
          >
            <el-option
              label="不限"
              value=""
            />
            <el-option
              label="成功"
              value="success"
            />
            <el-option
              label="失败"
              value="fail"
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
          :disabled="!selectData.length"
          style="margin-left: 12px"
          type="danger"
          @click="handleDelete(selectData)"
        >
          <template #icon>
            <icon name="el-icon-Delete" />
          </template>
          删除
        </el-button>
        <el-button
          style="margin-left: 12px"
          type="danger"
          @click="handleClear()"
        >
          <template #icon>
            <icon name="local-icon-clean" />
          </template>
          清空
        </el-button>
      </div>
      <div class="mt-4">
        <el-table
          v-loading="pager.loading"
          :data="pager.list"
          row-key="id"
          size="large"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="登录账号"
            min-width="100"
            prop="account"
            sortable
          />
          <el-table-column
            label="登录IP"
            min-width="100"
            prop="ip"
            sortable
          />
          <el-table-column
            label="操作系统"
            min-width="100"
            prop="os"
            sortable
          />
          <el-table-column
            label="浏览器"
            min-width="120"
            prop="browser"
            sortable
          />
          <el-table-column
            label="登录状态"
            min-width="100"
          >
            <template #default="{ row }">
              <el-tag
                v-if="row.status === 'success'"
                type="success"
              >
                成功
              </el-tag>
              <el-tag
                v-if="row.status === 'fail'"
                type="danger"
              >
                失败
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="登录时间"
            min-width="180"
            prop="createdAt"
            sortable
          />
          <el-table-column
            fixed="right"
            label="操作"
            min-width="80"
          >
            <template #default="{ row }">
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
  </div>
</template>
<script lang="ts" setup>
import { loginLogger } from '@/api/logger'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'

const selectData = ref<any[]>([])

const queryParams = reactive({
    account: '',
    ip: '',
    status: ''
})

const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

const handleDelete = async (id: any[]) => {
    await feedback.confirm('一旦删除无法恢复，确定要删除该条数据吗？', 'warning')
    await loginLogger.delete({ id })
    feedback.success('删除成功')
    await getList()
}

const handleClear = async () => {
    await feedback.confirm('一旦清空无法恢复，确定要清空所有日志吗？', 'warning')
    await loginLogger.clear()
    feedback.success('清空成功')
    await getList()
}

const { pager, getList, resetPage, resetParams } = usePaging({
    fetch: loginLogger.getList,
    params: queryParams
})

getList()
</script>

<style lang="scss" scoped></style>
