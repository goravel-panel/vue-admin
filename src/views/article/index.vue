<template>
  <div>
    <el-card
      class="!border-none mt-4"
      shadow="never"
    >
      <div class="flex">
        <router-link to="add">
          <el-button type="primary">
            <template #icon>
              <icon name="el-icon-Plus" />
            </template>
            添加
          </el-button>
        </router-link>
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
            label="标题"
            min-width="200"
            prop="title"
            sortable
          />
          <el-table-column
            label="分类"
            min-width="120"
            prop="category.name"
            sortable
          />
          <el-table-column
            label="来源"
            min-width="120"
            prop="from"
            sortable
          />
          <el-table-column
            label="发布时间"
            min-width="120"
            prop="createdAt"
            sortable
          />
          <el-table-column
            label="状态"
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
                v-if="row.isEnable === 0"
                type="danger"
              >
                停用
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
              >
                <router-link
                  :to="{
                    path: 'edit',
                    query: {
                      id: row.id
                    }
                  }"
                >
                  编辑
                </router-link>
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
        <div class="flex justify-end mt-5">
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
import { articleService } from '@/api/article'
import { usePaging } from '@/hooks/usePaging'
import feedback from '@/utils/feedback'

const selectData = ref<any[]>([])

const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

const handleDelete = async (id: any[]) => {
    await feedback.confirm('一旦删除无法恢复，确定要删除该条数据吗？', 'warning')
    await articleService.delete({ id })
    feedback.success('删除成功')
    await getList()
}

const { pager, getList } = usePaging({
    fetch: articleService.getList
})

getList()
</script>

<style lang="scss" scoped></style>
