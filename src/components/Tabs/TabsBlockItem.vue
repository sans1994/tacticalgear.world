<template>
    <slot></slot>
</template>

<script>
export default {
    name: 'TabsBlockItem',
    props: {
        header: null,
        disabled: Boolean
    }
}
</script>
