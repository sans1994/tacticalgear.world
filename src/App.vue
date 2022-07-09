<template>
    <router-view/>
</template>
<script>


export default {
    name: 'HomePage',
    data() {
        return {

        }
    },
    mounted() {
        this.$router.push('/map')
    }
}
</script>
