<template>
  <div
    v-loading="iframe.loading"
    :style="{ height: `calc(100vh)`, border: 'none' }"
    class="layout-view-bg-white flex mt1"
  >
    <iframe
      v-show="!iframe.loading"
      ref="iframeRef"
      :src="iframe.url"
      height="100%"
      width="100%"
      @load="handleLoad"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const iframe = reactive({
    loading: true,
    url: ''
})

const handleLoad = () => {
    iframe.loading = false
    iframe.url = route.meta.url as string
}
</script>
