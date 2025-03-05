<template>
  <el-image
    :style="styles"
    v-bind="props"
  >
    <template #error>
      <div class="image-slot">
        <el-icon>
          <icon-picture />
        </el-icon>
      </div>
    </template>
  </el-image>
</template>

<script lang="ts" setup>
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { imageProps } from 'element-plus'
import type { CSSProperties } from 'vue'
import { computed } from 'vue'

import { addUnit } from '@/utils/util'

const props = defineProps({
    width: {
        type: [String, Number],
        default: 'auto'
    },
    height: {
        type: [String, Number],
        default: 'auto'
    },
    radius: {
        type: [String, Number],
        default: 0
    },
    ...imageProps,
    hideOnClickModal: {
        type: Boolean,
        default: true
    }
})

const styles = computed<CSSProperties>(() => {
    return {
        width: addUnit(props.width),
        height: addUnit(props.height),
        borderRadius: addUnit(props.radius)
    }
})
</script>

<style lang="scss" scoped>
.el-image {
    display: block;

    .el-image__error {
        @apply text-xs;
    }
}

.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
}

.image-slot .el-icon {
    font-size: 30px;
}
</style>
