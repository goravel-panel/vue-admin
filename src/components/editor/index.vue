<template>
  <div
    :style="styles"
    class="border border-br flex flex-col"
  >
    <toolbar
      :default-config="toolbarConfig"
      :editor="editorRef"
      :mode="mode"
      class="border-b border-br"
    />
    <w-editor
      v-model="valueHtml"
      :default-config="editorConfig"
      :mode="mode"
      class="flex-1 overflow-hidden"
      @on-created="handleCreated"
    />
    <attach-picker
      ref="attachPickerRef"
      :limit="-1"
      :type="fileType"
      hidden-upload
      @change="selectChange"
    />
  </div>
</template>
<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import type { IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Boot } from '@wangeditor/editor'
import { Editor as WEditor, Toolbar } from '@wangeditor/editor-for-vue'
import type { CSSProperties } from 'vue'
import { onBeforeUnmount, ref, shallowRef } from 'vue'

import AttachPickerPopup from '@/components/attach/picker.vue'
import { addUnit } from '@/utils/util'

// 注册编辑器插件，支持空内容时，返回空字符串
function emptyHtmlPlugin(editor: WEditor) {
    const { getHtml } = editor
    const newEditor = editor
    newEditor.getHtml = () => {
        if (newEditor.isEmpty()) {
            return ''
        }
        return getHtml()
    }
    return newEditor
}

Boot.registerPlugin(emptyHtmlPlugin)

const props = withDefaults(
    defineProps<{
        modelValue?: string
        mode?: 'default' | 'simple'
        height?: string | number
        width?: string | number
        toolbarConfig?: Partial<IToolbarConfig>
    }>(),
    {
        modelValue: '',
        mode: 'default',
        height: '100%',
        width: 'auto',
        toolbarConfig: () => ({
            excludeKeys: ['uploadVideo']
        })
    }
)

const fileType = ref('')
const editorRef = shallowRef()
const attachPickerRef = shallowRef<InstanceType<typeof AttachPickerPopup>>()

const emit = defineEmits<{
    (event: 'update:modelValue', value: string): void
}>()

const valueHtml = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

let insertFn: any
const editorConfig: Partial<IEditorConfig> = {
    MENU_CONF: {
        uploadImage: {
            customBrowseAndUpload(insert: any) {
                fileType.value = 'image'
                attachPickerRef.value?.showPopup(-1)
                insertFn = insert
            }
        },
        uploadVideo: {
            customBrowseAndUpload(insert: any) {
                fileType.value = 'video'
                attachPickerRef.value?.showPopup(-1)
                insertFn = insert
            }
        }
    }
}

const styles = computed<CSSProperties>(() => ({
    height: addUnit(props.height),
    width: addUnit(props.width)
}))

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) {
        return
    }
    editor.destroy()
})

const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

const selectChange = (fileUrl: string[]) => {
    fileUrl.forEach((url) => {
        insertFn(url)
    })
}

</script>

<style lang="scss">
.w-e-full-screen-container {
    z-index: 999;
}

.w-e-text-container [data-slate-editor] ul {
    list-style: disc;
}

.w-e-text-container [data-slate-editor] ol {
    list-style: decimal;
}

h1 {
    font-size: 2em;
}

h2 {
    font-size: 1.5em;
}

h3 {
    font-size: 1.17em;
}

h4 {
    font-size: 1em;
}

h5 {
    font-size: 0.83em;
}

h1,
h2,
h3,
h4,
h5 {
    font-weight: bold;
}
</style>
