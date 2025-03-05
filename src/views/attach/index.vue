<template>
  <div class="material-index">
    <el-card
      class="!border-none"
      shadow="never"
    >
      <el-tabs
        v-model="activeTab"
        style="margin-left: -5px"
      >
        <div class="material">
          <div class="material__left">
            <div class="flex-1 min-h-0">
              <el-scrollbar>
                <div class="material-left__content pt-3 p-b-4">
                  <el-tree
                    ref="treeRef"
                    :current-node-key="cateId"
                    :data="cateList"
                    :expand-on-click-node="false"
                    :highlight-current="true"
                    empty-text="''"
                    node-key="id"
                    @node-click="handleCateSelect"
                  >
                    <template #default="{ data }">
                      <div class="flex flex-1 items-center min-w-0 pr-4">
                        <img
                          class="w-[20px] h-[16px] mr-3"
                          src="@/assets/images/icon_folder.png"
                        >
                        <span class="flex-1 truncate mr-2">
                          <overflow-tooltip :content="data.name" />
                        </span>
                        <el-dropdown
                          v-if="data.id > 0"
                          :hide-on-click="false"
                        >
                          <span class="muted m-r-10">···</span>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <popover-input
                                :limit="20"
                                :value="data.name"
                                show-limit
                                size="default"
                                teleported
                                width="300px"
                                @confirm="
                                  handleCateRename(
                                    $event,
                                    data.id
                                  )
                                "
                              >
                                <div>
                                  <el-dropdown-item>
                                    命名分组
                                  </el-dropdown-item>
                                </div>
                              </popover-input>
                              <div @click="handleCateDelete(data.id)">
                                <el-dropdown-item>
                                  删除分组
                                </el-dropdown-item>
                              </div>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                      </div>
                    </template>
                  </el-tree>
                </div>
              </el-scrollbar>
            </div>
            <div class="flex justify-center pt-3 border-t border-br">
              <popover-input
                :limit="20"
                show-limit
                size="default"
                teleported
                width="300px"
                @confirm="handleCateAdd"
              >
                <el-button> 添加分组</el-button>
              </popover-input>
            </div>
          </div>
          <div class="material__center flex flex-col">
            <div class="operate-btn flex">
              <div class="flex-1 flex">
                <upload
                  :data="{ cid: cateId }"
                  :show-progress="true"
                  :type="type"
                  class="mr-3"
                  @change="handleFileRefresh"
                >
                  <el-button type="primary">
                    本地上传
                  </el-button>
                </upload>
                <el-button
                  :disabled="!selectedFiles?.length"
                  type="danger"
                  @click="handleFileDelete()"
                >
                  删除
                </el-button>

                <popup
                  class="ml-3 inline"
                  title="移动文件"
                  @confirm="handleFileMove"
                >
                  <template #trigger>
                    <el-button :disabled="!selectedFiles?.length">
                      移动
                    </el-button>
                  </template>

                  <div>
                    <span class="mr-5">移动文件至</span>
                    <el-select
                      v-model="moveId"
                      placeholder="请选择"
                      style="width: 260px"
                    >
                      <template
                        v-for="item in cateList"
                        :key="item.id"
                      >
                        <el-option
                          v-if="item.id !== ''"
                          :label="item.name"
                          :value="item.id"
                        />
                      </template>
                    </el-select>
                  </div>
                </popup>
              </div>
              <el-select
                v-model="queryParams.mime"
                class="max-w-52 ml-3 mr-3"
                clearable
                placeholder="请选择图片类型"
              >
                <el-option
                  v-for="item in mimeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input
                v-model="queryParams.name"
                placeholder="请输入图片名称"
                @keyup.enter="handleFileRefresh"
              >
                <template #append>
                  <el-button @click="handleFileRefresh">
                    <template #icon>
                      <icon name="el-icon-Search" />
                    </template>
                  </el-button>
                </template>
              </el-input>
            </div>
            <div class="material-center__content flex flex-col flex-1 mb-1 min-h-0">
              <el-table
                ref="tableRef"
                :data="pager.list"
                class="mt-4"
                height="100%"
                size="large"
                width="100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="30"
                />
                <el-table-column width="90">
                  <template #default="{ row }">
                    <el-link
                      :underline="false"
                      @click.stop="handlePreview(row.url)"
                    >
                      <image-thumb
                        :url="row.url"
                        height="50px"
                        width="50px"
                      />
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  label="原始名称"
                  min-width="120"
                  prop="name"
                  show-overflow-tooltip
                  sortable
                />
                <el-table-column
                  label="存储位置"
                  min-width="120"
                  prop="disk"
                  sortable
                />
                <el-table-column
                  label="图片类型"
                  min-width="120"
                  prop="mime"
                  sortable
                />
                <el-table-column
                  label="图片大小"
                  min-width="120"
                  prop="size"
                  sortable
                />
                <el-table-column
                  label="上传时间"
                  min-width="180"
                  prop="createdAt"
                  sortable
                />
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="180"
                >
                  <template #default="{ row }">
                    <div class="inline-block">
                      <popover-input
                        :limit="50"
                        :value="row.name"
                        show-limit
                        size="default"
                        teleported
                        width="400px"
                        @confirm="handleFileRename($event, row.id)"
                      >
                        <el-button
                          link
                          type="primary"
                        >
                          重命名
                        </el-button>
                      </popover-input>
                    </div>
                    <div class="inline-block ml-1">
                      <el-button
                        link
                        type="primary"
                        @click.stop="handleFileCopy(row.url)"
                      >
                        复制
                      </el-button>
                    </div>
                    <div class="inline-block ml-2">
                      <el-button
                        link
                        type="danger"
                        @click.stop="handleFileDelete([row.id])"
                      >
                        删除
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div
                v-if="!pager.loading && !pager.list?.length"
                class="flex flex-1 justify-center items-center"
              >
                暂无数据~
              </div>
            </div>
            <div class="material-center__footer flex justify-between items-center mt-2">
              <div class="flex" />
              <pagination
                v-model="pager"
                layout="total, prev, pager, next"
                style="margin-bottom: 2px"
                @change="getFileList"
              />
            </div>
          </div>
          <image-preview
            v-model="showPreview"
            :type="type"
            :url="previewUrl"
          />
        </div>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ElTree } from 'element-plus'
import { shallowRef } from 'vue'

import { useCate, useFile } from '@/components/attach/hook'
import ImagePreview from '@/components/attach/preview.vue'
import ImageThumb from '@/components/attach/thumb.vue'

const props = defineProps({
    // 图片宽度
    width: {
        type: String,
        default: '100px'
    },
    // 图片高度
    height: {
        type: String,
        default: '100px'
    },
    limit: {
        type: Number,
        default: -1
    },
    type: {
        type: String,
        default: 'image'
    },
    mode: {
        type: String,
        default: 'picker'
    },
    pageSize: {
        type: Number,
        default: 15
    }
})

const activeTab = ref('image')
const previewUrl = ref<string | undefined>(undefined)
const showPreview = ref<boolean>(false)
const { limit } = toRefs(props)
const emit = defineEmits(['change'])
const typeValue = computed<string>(() => {
    return props.type
})

const treeRef = shallowRef<InstanceType<typeof ElTree>>()

const {
    cateId,
    cateList,
    getCateAll,
    handleCateSelect,
    handleCateAdd,
    handleCateRename,
    handleCateDelete
} = useCate(typeValue.value)

const {
    moveId,
    pager,
    handleFileRefresh,
    queryParams,
    selectedFiles,
    getFileList,
    handleFileCopy,
    handleFileDelete,
    handleFileRename,
    handleFileMove
} = useFile(cateId, typeValue, limit, props.pageSize)

const handlePreview = (url: string) => {
    previewUrl.value = url
    showPreview.value = true
}

const handleSelectionChange = (val: any[]) => {
    selectedFiles.value = val
}

const mimeOptions = [
    {
        value: 'image/jpeg',
        label: 'image/jpeg'
    },
    {
        value: 'image/png',
        label: 'image/png'
    },
    {
        value: 'image/gif',
        label: 'image/gif'
    },
    {
        value: 'image/webp',
        label: 'image/webp'
    }
]

watch(cateId, () => {
    queryParams.name = ''
    handleFileRefresh()
})

watch(
    selectedFiles,
    (val: any[]) => {
        emit('change', val)
    },
    {
        deep: true
    }
)

onMounted(async () => {
    cateId.value = 0
    // 初始化
    await getCateAll()
    treeRef.value?.setCurrentKey(cateId.value)
})
</script>

<style lang="scss" scoped>
.material {
    @apply h-full min-h-0 flex flex-1;
    &__left {
        @apply border-r border-br flex flex-col w-[200px];
        :deep(.el-tree-node__content) {
            height: 36px;
        }
    }

    &__center {
        flex: 1;
        min-width: 0;
        padding: 15px 0 0 15px;

        .list-icon {
            border-radius: 3px;
            display: flex;
            padding: 5px;
            cursor: pointer;

            &.select {
                @apply text-primary bg-primary-light-8;
            }
        }

        .file-list {
            .file-item-wrap {
                &:not(:last-child) {
                    margin-right: 12px;
                }

                visibility: visible;
                line-height: 1.3;
                cursor: pointer;

                .item-selected {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                    background-color: rgba(0, 0, 0, 0.5);
                    box-sizing: border-box;
                }
            }
        }
    }

    &__right {
        @apply border-l border-br flex flex-col;
        width: 130px;

        .select-lists {
            padding: 10px;
        }
    }
}

.material-index {
    :deep(.el-tabs) {
        height: calc(85vh);
        display: flex;
        flex-direction: column;

        .el-tabs__header {
            margin-bottom: 0 !important;
        }

        .el-tabs__content,
        .el-tab-pane {
            margin-top: -20px;
            min-height: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
        }
    }
}
</style>
