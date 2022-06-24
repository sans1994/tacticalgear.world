<template>
    <div class="container">
        <tabs-block ref="tabview1">
            <tabs-block-item header="MAP">
                <map-block/>
            </tabs-block-item>
            <tabs-block-item header="LIST">
                111
            </tabs-block-item>
        </tabs-block>
    </div>
</template>

<script>
import MapBlock from "../components/MapBlock.vue";
import TabsBlock from "../components/Tabs/TabsBlock.vue";
import TabsBlockItem from "../components/Tabs/TabsBlockItem.vue";
import {mapActions} from "vuex";
export default {
    name: 'HomePage',
    components: {
        MapBlock,
        TabsBlock,
        TabsBlockItem
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
