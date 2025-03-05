<template>
  <div
    v-loading="pager.loading"
    class="material"
  >
    <div class="material__left">
      <div class="flex-1 min-h-0">
        <el-scrollbar>
          <div class="material-left__content pt-4 p-b-4">
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
                          @confirm="handleCateRename($event, data.id)"
                        >
                          <div>
                            <el-dropdown-item>
                              命名分组
                            </el-dropdown-item>
                          </div>
                        </popover-input>
                        <div @click="handleCateDelete(data.id)">
                          <el-dropdown-item>删除分组</el-dropdown-item>
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

      <div class="flex justify-center p-2 border-t border-br">
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
        </div>
        <el-input
          v-model="queryParams.name"
          class="w-60 mr-3"
          placeholder="请输入名称"
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
        <el-scrollbar v-if="pager.list?.length">
          <ul class="file-list flex flex-wrap mt-4">
            <li
              v-for="item in pager.list"
              :key="item.id"
              class="file-item-wrap"
              style="width: 108px"
            >
              <del-wrap @close="handleFileDelete([item.id])">
                <image-thumb
                  :type="type"
                  :url="item.url"
                  height="108px"
                  width="108px"
                  @click="handleFileSelect(item)"
                >
                  <div
                    v-if="isSelected(item.id)"
                    class="item-selected"
                  >
                    <icon
                      :size="24"
                      color="#fff"
                      name="el-icon-Check"
                    />
                  </div>
                </image-thumb>
              </del-wrap>

              <overflow-tooltip
                :content="item.name"
                class="mt-1"
              />

              <div class="operation-btn flex items-center">
                <popover-input
                  :limit="50"
                  :value="item.name"
                  show-limit
                  size="default"
                  teleported
                  width="400px"
                  @confirm="handleFileRename($event, item.id)"
                >
                  <Icon
                    :size="16"
                    name="local-icon-edit"
                  />
                </popover-input>
                <icon
                  :size="16"
                  name="local-icon-show"
                  style="margin: 0 20px"
                  @click="handlePreview(item.url)"
                />
                <icon
                  :size="16"
                  name="local-icon-copy"
                  @click="handleFileCopy(item.url)"
                />
              </div>
            </li>
          </ul>
        </el-scrollbar>

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
    <div
      v-if="mode === 'picker'"
      class="material__right"
    >
      <div class="flex justify-between pt-3 pl-2 pr-2 flex-wrap">
        <div class="sm flex items-center">
          已选择 {{ selectedFiles.length }}
          <span v-if="limit">/{{ limit }}</span>
        </div>
        <el-button
          link
          type="primary"
          @click="handleClearSelect"
        >
          清空
        </el-button>
      </div>
      <div class="flex-1 min-h-0">
        <el-scrollbar class="ls-scrollbar">
          <ul class="select-lists flex flex-col p-t-3">
            <li
              v-for="item in selectedFiles"
              :key="item.id"
              class="mb-4"
            >
              <div class="select-item">
                <del-wrap @close="handleCancelSelect(item.id)">
                  <image-thumb
                    :type="type"
                    :url="item.url"
                    height="100px"
                    width="100px"
                  />
                </del-wrap>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <image-preview
      v-if="previewUrl"
      v-model="showPreview"
      :type="type"
      :url="previewUrl"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'

import { useCate, useFile } from './hook'
import ImagePreview from './preview.vue'
import ImageThumb from './thumb.vue'

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
        default: 2
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
        default: 12
    }
})
const emit = defineEmits(['change'])
const { limit } = toRefs(props)
const typeValue = computed<string>(() => {
    return props.type
})

const visible: Ref<boolean> = inject('visible', ref<boolean>(false))!
const previewUrl = ref('')
const showPreview = ref(false)
const {
    treeRef,
    cateId,
    cateList,
    handleCateAdd,
    handleCateRename,
    handleCateDelete,
    getCateAll,
    handleCateSelect
} = useCate(typeValue.value)

const {
    pager,
    queryParams,
    selectedFiles,
    isSelected,
    getFileList,
    handleFileRefresh,
    handleFileDelete,
    handleFileSelect,
    handleClearSelect,
    handleCancelSelect,
    handleFileRename,
    handleFileCopy
} = useFile(cateId, typeValue, limit, props.pageSize)

const handlePreview = (url: string) => {
    previewUrl.value = url
    showPreview.value = true
}
watch(
    () => visible.value,
    async (val: boolean) => {
        if (val) {
            // 初始化
            cateId.value = 0
            await getCateAll()
            treeRef.value?.setCurrentKey(cateId.value)
            await getFileList()
        }
    },
    {
        immediate: true
    }
)
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

defineExpose({
    handleClearSelect
})
</script>


<style lang="scss" scoped>
.material {
    @apply h-full min-h-0 flex flex-1;
    &__left {
        @apply border-r border-br flex flex-col w-[200px];
        :deep(.el-tree-node__content) {
            height: 36px;

            .el-tree-node__label {
                display: flex;
                flex: 1;
                min-width: 0;
            }
        }
    }

    &__center {
        flex: 1;
        min-width: 0;
        min-height: 0;
        padding: 16px 16px 0;

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
                margin-right: 16px;
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

                .operation-btns {
                    height: 28px;
                    visibility: hidden;
                }

                &:hover .operation-btns {
                    visibility: visible;
                }
            }
        }
    }

    &__right {
        @apply border-l border-br flex flex-col;
        width: 130px;

        .select-lists {
            padding: 10px;

            .select-item {
                width: 100px;
                height: 100px;
            }
        }
    }
}
</style>

<style lang="scss" scoped>
.material {
    @apply h-full min-h-0 flex flex-1;
    &__left {
        @apply border-r border-br flex flex-col w-[180px];
        :deep(.el-tree-node__content) {
            height: 36px;
        }
    }

    &__center {
        flex: 1;
        min-width: 0;
        min-height: 0;
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

                .operation-btn {
                    height: 30px;
                    visibility: hidden;
                }

                &:hover .operation-btn {
                    visibility: visible;
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
</style>
