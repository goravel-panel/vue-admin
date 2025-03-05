<template>
  <div>
    <div
      :style="{ height: height, width: width }"
      class="file-item relative"
    >
      <el-image
        v-if="url && type === 'image'"
        :src="url"
        class="image"
        fit="contain"
      />
      <video
        v-else-if="type === 'video'"
        :src="url"
        class="video"
      />
      <div
        v-if="type === 'video'"
        class="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] rounded-full w-5 h-5 flex justify-center items-center bg-[rgba(0,0,0,0.3)]"
      >
        <icon
          :size="18"
          color="#fff"
          name="el-icon-CaretRight"
        />
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        // 图片地址
        url: {
            type: String,
            default: ''
        },
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
        // 文件类型
        type: {
            type: String,
            default: 'image'
        }
    },
    emits: ['close']
})
</script>

<style lang="scss" scoped>
.file-item {
    box-sizing: border-box;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    @apply bg-br-extra-light border border-br-extra-light;
    .image,
    .video {
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }
}
</style>
