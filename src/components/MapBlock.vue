<template>
    <multiselect
        v-model="selectedCountry"
        :options="countries"
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
    </multiselect>
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
                <l-popup
                    :options="{
                        offset: [0, -20]
                    }"
                >
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
import 'vue-multiselect/dist/vue-multiselect.css'

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
            countries: [],
            selectedCountry: null,
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
            return [this.iconWidth / 2, this.iconHeight / 2];
        },
    },
    methods: {

        getIcon() {
            return L.icon({
                iconUrl: icon,
                iconSize: this.iconSize,
                iconAnchor: this.anchorSize
            });
        },
        getShops() {
            this.$api.getEntries({
                content_type: 'shop'
            })
                .then(entries => {
                    this.shops = entries.items;
                    console.log(entries.items);
                })
                .catch(err => console.log(err))
        },
        getCountries() {
            this.$api.getEntries({
                content_type: 'country'
            })
                .then(entries => {
                    entries.items.forEach(item => {
                        this.countries.push({
                            name: item.fields.name,
                            id: item.sys.id
                        })
                    })
                })
                .catch(err => console.log(err))
        },
        onCountrySelect(e) {
            this.$api.getEntries({
                'fields.country.sys.id': e.id,
                content_type: 'shop'
            })
                .then(entries => {
                    this.shops = entries.items
                })
                .catch(err => console.log(err))
        },
        onCountryRemove() {
            this.$api.getEntries({
                content_type: 'shop'
            })
                .then(entries => {
                    console.log(entries)
                    this.shops = entries.items
                })
                .catch(err => console.log(err))
        }
    },
    created() {
        this.getShops()
        this.getCountries()
    }
}
</script>
