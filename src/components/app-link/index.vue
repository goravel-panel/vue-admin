<template>
  <component
    :is="type"
    v-bind="linkProps"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
interface Props {
    to: string | Record<string, string>
    replace?: boolean
}

const props = defineProps<Props>()

const isExternalLink = computed(() => {
    return typeof props.to === 'string' && props.to.startsWith('http')
})

const type = computed<string>(() => {
    return isExternalLink.value ? 'a' : 'router-link'
})

interface LinkProps {
    href?: string
    target?: string
    to?: string | Record<string, string>
    replace?: boolean
}

const linkProps = computed<LinkProps>(() => {
    if (isExternalLink.value) {
        return {
            href: props.to as string,
            target: '_blank'
        }
    }
    return props
})
</script>