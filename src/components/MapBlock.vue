<template>
    <div class="contacts__map">
        <l-map
            :center="[49.84766789957655, 23.959183898781497]"
            :max-zoom="20"
            :min-zoom="2"
            :zoom-animation="true"
            :zoom-animation-threshold="2"
            :marker-zoom-animation="true"
            :zoom="2"
        >
            <l-tile-layer :url="tileUrl"/>
            <l-marker
                v-for="(marker, idx) in shops"
                :key="idx"
                :lat-lng="marker.fields.latLng"
                :icon="getIcon()"
            >
                <l-popup>
                    <h3>
                        {{ marker.fields.name }}
                    </h3>
                    <a
                        :href="marker.fields.link"
                        target="_blank"
                    >
                        {{marker.fields.link}}
                    </a>
                </l-popup>
            </l-marker>
        </l-map>
    </div>
</template>

<script>
import "leaflet/dist/leaflet.css"
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import icon from '/src/assets/images/poi.svg'

export default {
    name: "MapBlock",
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup
    },
    data() {
        return {
            shops: [],
            iconWidth: 60,
            iconHeight: 60,
            tileUrl: 'https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png'
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
        this.$api.getEntries({
            content_type: 'shop'
        })
            .then(entries => {
                this.shops = entries.items;
                console.log(entries.items);
            })
        .catch(err => console.log(err))
    }
}
</script>
