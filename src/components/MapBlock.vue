<template>
    <vue-multiselect
        v-model="selectedCountry"
        :options="GET_COUNTRIES"
        :searchable="true"
        track-by="name"
        label="name"
        :close-on-select="true"
        :show-labels="false"
        placeholder="Pick a value"
        @select="onCountrySelect($event)"
        @remove="onCountryRemove"
    >
        <template slot="singleLabel" slot-scope="{ option }">
            {{ option.name }}>
        </template>
    </vue-multiselect>

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
                v-for="(marker, idx) in GET_SHOPS"
                :key="idx"
                :lat-lng="marker?.fields?.latLng"
                :icon="getIcon()"
            >
                <l-popup
                    :options="{
                        offset: [0, 0]
                    }"
                >
                    <h3>
                        {{ marker.fields.name }}
                    </h3>
                    <a
                        :href="marker.fields.link"
                        target="_blank"
                    >
                        {{ marker.fields.link }}
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
import icon from "/src/assets/images/poi.svg";
import 'vue-multiselect/dist/vue-multiselect.css'
import {mapActions, mapGetters} from "vuex";

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
            value: null,
            options: ['list', 'of', 'options'],
            selectedCountry: null,
            iconWidth: 60,
            iconHeight: 60,
            tileUrl: 'https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png'
        };
    },
    computed: {
        ...mapGetters([
            'GET_SHOPS',
            'GET_COUNTRIES'
        ]),
        iconSize() {
            return [this.iconWidth, this.iconHeight];
        },
        anchorSize() {
            return [this.iconWidth / 2, this.iconHeight / 2];
        }
    },
    methods: {
        ...mapActions([
            'ACT_GET_SHOPS_BY_COUNTRY',
            'ACT_GET_SHOPS'
        ]),
        getIcon() {
            return L.icon({
                iconUrl: icon,
                iconSize: this.iconSize,
                iconAnchor: this.anchorSize
            });
        },
        onCountrySelect(e) {
            this.ACT_GET_SHOPS_BY_COUNTRY(e.id)
        },
        onCountryRemove() {
            this.ACT_GET_SHOPS()
        }
    }
}
</script>
