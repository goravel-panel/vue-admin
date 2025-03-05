<template>
  <div class="pagination">
    <el-pagination
      v-model:current-page="pager.pageNo"
      v-model:page-size="pager.pageSize"
      :hide-on-single-page="true"
      :pager-count="pager.pageCount"
      :total="pager.total"
      v-bind="props"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
  </div>
</template>

<script lang="ts" setup>
interface Props {
    modelValue?: Record<string, any>
    pageSizes?: number[]
    layout?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => ({}),
    pageSizes: () => [15, 20, 30, 40],
    layout: 'total, sizes, prev, pager, next, jumper'
})

const emit = defineEmits<{
    (event: 'change'): void
    (event: 'update:modelValue', value: any): void
}>()

const pager = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

const sizeChange = () => {
    pager.value.page = 1
    emit('change')
}

const currentChange = () => {
    emit('change')
}
</script>
