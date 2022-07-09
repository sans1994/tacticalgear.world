<template>
    <div class="container">
        <TabMenu :model="tabMenuItems" :active-index="active"/>
        <router-view name="tabsMap"/>
        <router-view name="tabsList"/>
    </div>
</template>

<script>

import {mapActions} from "vuex";

export default {
    name: 'HomePage',
    data() {
        return {
            active: 0,
            tabMenuItems: [
                {
                    label: 'MAP',
                    icon: 'pi pi-map-marker',
                    to: '/map'
                },
                {
                    label: 'LIST',
                    icon: 'pi pi-list',
                    to: '/list'
                }
            ]
        }
    },
    methods: {
        ...mapActions([
            'ACT_GET_SHOPS',
            'ACT_GET_COUNTRIES'
        ])
    },
    created() {
        this.ACT_GET_SHOPS()
        this.ACT_GET_COUNTRIES()
    }
}
</script>
