<template>
  <el-date-picker
    v-model="content"
    clearable
    end-placeholder="结束时间"
    format="YYYY-MM-DD"
    range-separator="-"
    start-placeholder="开始时间"
    type="daterange"
    value-format="YYYY-MM-DD"
  />
</template>

<script lang="ts" setup>
import { computed, withDefaults } from 'vue'

/* Props S */
const props = withDefaults(
    defineProps<{
        startTime?: string
        endTime?: string
    }>(),
    {
        startTime: '',
        endTime: ''
    }
)
const emit = defineEmits(['update:startTime', 'update:endTime'])

const content = computed<any>({
    get: () => {
        return [props.startTime, props.endTime]
    },
    set: (value: Event | any) => {
        if (value === null) {
            emit('update:startTime', '')
            emit('update:endTime', '')
        } else {
            emit('update:startTime', value[0])
            emit('update:endTime', value[1])
        }
    }
})
</script>
