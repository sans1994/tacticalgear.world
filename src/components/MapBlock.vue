<template>
    <div class="contacts__map">
        <l-map
            :center="[49.84766789957655, 23.959183898781497]"
            :max-zoom="20"
            :min-zoom="2"
            :zoom-animation="true"
            :zoom-animation-threshold="2"
            :marker-zoom-animation="true"
            :zoom="14"
        >
            <l-tile-layer :url="tileUrl"/>
            <l-marker
                v-for="(marker, idx) in shops"
                :key="idx"
                :lat-lng="marker.fields.latLng"
                :icon="getIcon()"
            />
        </l-map>
    </div>
</template>

<script>
import "leaflet/dist/leaflet.css"
import L from 'leaflet'
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import icon from '/src/assets/images/poi.svg'

export default {
    name: "MapBlock",
    components: {
        LMap,
        LTileLayer,
        LMarker
    },
    data() {
        return {
            shops: [],
            iconWidth: 60,
            iconHeight: 60,
            tileUrl: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
        };
    },
    computed: {
        iconSize() {
            return [this.iconWidth, this.iconHeight];
        },
        anchorSize() {
            return [this.iconWidth / 2, this.iconHeight];
        },
    },
    methods: {

        getIcon() {
            return L.icon({
                iconUrl: icon,
                iconSize: this.iconSize,
                iconAnchor: this.anchorSize
            });
        }
    },
    mounted() {
        this.$api.getEntries()
            .then(entries => {
                this.shops = entries.items
            })
        .catch(err => console.log(err))
    }
}
</script>
