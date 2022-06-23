<template>
    <div class="container">
        <tabs-block ref="tabview1">
            <tabs-block-item header="MAP">
                <map-block/>
            </tabs-block-item>
            <tabs-block-item header="LIST">
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.</p>
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
