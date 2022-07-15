<template>
    <div class="container page page--home">
        <router-view name="tabsMap"/>
        <router-view name="tabsList"/>
        <TabMenu
            :model="tabMenuItems"
            :active-index="active"
            class="main-menu"
        />
    </div>
</template>

<script>

import {mapActions} from "vuex";

export default {
    name: 'MainLayout',
    data() {
        return {
            active: 0,
            tabMenuItems: [
                {
                    label: 'MAP',
                    icon: 'pi pi-map-marker',
                    to: '/'
                },
                {
                    label: 'LIST',
                    icon: 'pi pi-list',
                    to: '/list'
                },
                {
                    label: 'FAVOURITES',
                    icon: 'pi pi-heart-fill',
                    to: '/favourites'
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
