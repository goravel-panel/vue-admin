<template>
  <div>
    <el-tooltip
      :append-to="'body'"
      v-bind="props"
    >
      <div
        ref="textRef"
        :style="{ textOverflow: overflowType }"
        class="overflow-text truncate"
      >
        {{ content }}
      </div>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { type Placement, useTooltipContentProps } from 'element-plus'
import type { PropType } from 'vue'

const props = defineProps({
    ...useTooltipContentProps,
    teleported: {
        type: Boolean,
        default: false
    },
    placement: {
        type: String as PropType<Placement>,
        default: 'top'
    },
    overflowType: {
        type: String as PropType<'ellipsis' | 'unset' | 'clip'>,
        default: 'ellipsis'
    }
})
const textRef = shallowRef<HTMLElement>()
const disabled = ref(false)

useEventListener(textRef, 'mouseenter', () => {
    disabled.value = textRef.value?.scrollWidth! <= textRef.value?.offsetWidth!
})
</script>

<style></style>
