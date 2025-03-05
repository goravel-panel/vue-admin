<template>
  <div class="icon-select">
    <el-popover
      v-model:visible="state.popoverVisible"
      :width="state.popoverWidth"
      trigger="contextmenu"
    >
      <div
        @mouseover.stop="state.mouseoverSelect = true"
        @mouseout.stop="state.mouseoverSelect = false"
      >
        <div>
          <div class="flex justify-between">
            <div class="mb-3">
              请选择图标
            </div>
            <div>
              <span
                v-for="(item, index) in iconTabsMap"
                :key="index"
                :class="{
                  'text-primary': index === tabIndex
                }"
                class="cursor-pointer text-sm ml-2"
                @click="tabIndex = index"
              >
                {{ item.name }}
              </span>
            </div>
          </div>

          <div class="h-[280px]">
            <el-scrollbar>
              <div class="flex flex-wrap">
                <div
                  v-for="item in getIcons"
                  :key="item"
                  class="m-1"
                >
                  <el-button
                    style="width: 20px"
                    @click="handleSelect(item)"
                  >
                    <icon
                      :name="item"
                      :size="18"
                    />
                  </el-button>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <template #reference>
        <el-input
          ref="inputRef"
          v-model.trim="state.inputValue"
          :autofocus="false"
          :disabled="disabled"
          clearable
          placeholder="点击选择图标"
          @blur="handleBlur"
          @clear="handleClear"
          @focus="handleFocus"
        >
          <template #prepend>
            <div
              v-if="modelValue"
              class="flex items-center"
              style="cursor: pointer"
            >
              <icon
                :key="modelValue"
                :name="modelValue"
                :size="16"
                @click="handleFocus"
              />
            </div>

            <template v-else>
              无
            </template>
          </template>
        </el-input>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { ElInput } from 'element-plus'
import { computed, nextTick, onMounted, reactive, shallowRef, watch } from 'vue'

import { getElementPlusIconNames, getLocalIconNames } from './index'

interface Props {
    modelValue: string
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    disabled: false
})

const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'change', value: string): void
}>()

const tabIndex = ref(0)
const iconTabsMap = [
    {
        name: '系统图标',
        icons: getElementPlusIconNames()
    },
    {
        name: '本地图标',
        icons: getLocalIconNames()
    }
]

const inputRef = shallowRef<InstanceType<typeof ElInput>>()

const state = reactive({
    inputValue: '',
    popoverWidth: 0,
    popoverVisible: false,
    mouseoverSelect: false,
    inputFocus: false
})

// input 框获取焦点
const handleFocus = () => {
    state.inputFocus = true
    state.popoverVisible = true
}

// input 框失去焦点
const handleBlur = () => {
    state.inputFocus = false
    state.popoverVisible = false
}

// 选中图标
const handleSelect = (icon: string) => {
    state.inputValue = icon
    state.popoverVisible = false
    state.mouseoverSelect = false
    emits('update:modelValue', icon)
    emits('change', icon)
}

// 取消选中
const handleClear = () => {
    state.inputValue = ''
    emits('update:modelValue', '')
    emits('change', '')
}

// 获取图标
const getIcons = computed(() => {
    return iconTabsMap[tabIndex.value]?.icons ?? []
})

// 获取 input 的宽度
const getInputWidth = () => {
    nextTick(() => {
        const inputWidth = inputRef.value?.$el.offsetWidth
        state.popoverWidth = inputWidth < 300 ? 300 : inputWidth
    })
}

// 监听body点击事件
useEventListener(document, 'click', () => {
    state.popoverVisible = !!(state.inputFocus || state.mouseoverSelect)
})

watch(
    () => state.popoverVisible,
    async (value) => {
        await nextTick()
        if (value) {
            inputRef.value?.focus()
        } else {
            inputRef.value?.blur()
        }
    }
)

watch(props, (val) => {
    state.inputValue = val.modelValue
})

onMounted(() => {
    state.inputValue = props.modelValue
    getInputWidth()
})
</script>

<style lang="scss">
.el-input-group__prepend {
    width: 20px;
}
</style>
