<template>
    <Toast position="bottom-right"/>
    <DataTable
        ref="table"
        :value="this.GET_DATA"
        :paginator="true"
        class="p-datatable-customers"
        :rows="15"
        dataKey="id"
        v-model:filters="filters2"
        :loading="loading2"
        responsiveLayout="scroll"
        :globalFilterFields="['name','country.name','representative.name','status']"
    >
        <template #header>
            <div class="flex justify-content-end search-wrapper">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText
                                v-model="filters2['global'].value"
                                placeholder="Keyword Search"
                            />
                        </span>
            </div>
        </template>
        <template #empty>
            No customers found.
        </template>
        <template #loading>
            Loading customers data. Please wait.
        </template>
        <Column
            field="name"
            header="Name"
            style="min-width:12rem"
        >
            <template #body="{data}">
                {{data.name}}
            </template>
        </Column>
        <Column
            header="Country"
            class="column--country"
            filterField="country.name"
            style="min-width:12rem"
        >
            <template #body="{data}">
                <div>
                    <img
                        :src="data.country.img.fields.file.url"
                        width="30"
                    />
                    <span class="image-text">
                                {{data.country.name}}
                            </span>
                </div>
            </template>
        </Column>
        <Column header="Link" style="min-width:12rem">
            <template #body="{data}">
                <a
                    :href="data.link"
                    target="_blank"
                >
                    {{ data.link }}
                </a>
            </template>
        </Column>
        <Column header="Favourites" style="min-width:12rem">
            <template #body="{data}">
                <Button @click="toggleFavourite(data)">
                    <i :class="checkIsFavourite(data.id)"></i>
                </Button>
            </template>
        </Column>
    </DataTable>
</template>

<script>
import CustomerService from '../service/CustomerService';
import {FilterMatchMode,FilterOperator} from 'primevue/api';
import {mapActions, mapGetters} from "vuex";

export default {
    name: 'ListPage',
    data() {
        return {
            customers1: null,
            customers2: null,
            filters1: null,
            filters2: {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                'name': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
                'country.name': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
                'representative': {value: null, matchMode: FilterMatchMode.IN},
                'status': {value: null, matchMode: FilterMatchMode.EQUALS},
                'verified': {value: null, matchMode: FilterMatchMode.EQUALS}
            },
            loading1: true,
            loading2: true
        }
    },
    computed: {
        ...mapGetters([
            'GET_DATA',
            'GET_FAVOURITES'
        ])
    },
    created() {
        this.customerService = new CustomerService();
        this.initFilters1();
    },
    mounted() {
        this.customerService.getCustomersLarge().then(data => {
            this.customers1 = data;
            this.loading1 = false;
            this.customers1.forEach(customer => customer.date = new Date(customer.date));
        });

        this.customerService.getCustomersLarge().then(data => {
            this.customers2 = data;
            this.loading2 = false;
            this.customers2.forEach(customer => customer.date = new Date(customer.date));
        });
    },
    watch: {
        '$store.state.data': (oldVal, newVal) => {
            console.log(oldVal);
        }
    },
    methods: {
        ...mapActions([
            'ACT_TOGGLE_FAVOURITE',
            'ACT_CHECK_IS_FAVOURITE'
        ]),
        checkIsFavourite(id) {
            if (this.GET_FAVOURITES.some(el => el.id === id)) {
                return 'pi pi-heart-fill'
            } else {
                return 'pi pi pi-heart'
            }
        },
        toggleFavourite(data) {
            this.ACT_TOGGLE_FAVOURITE(data)
            if (this.GET_FAVOURITES.some(el => el.id === data.id)) {
                this.$toast.add({severity:'success', summary: `${data.name} added to favourites`, life: 3000});
            } else {
                this.$toast.add({severity:'warn', summary: `${data.name} removed from favourites`, life: 3000});
            }
        },
        formatDate(value) {
            return value.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        },
        formatCurrency(value) {
            return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
        },
        clearFilter1() {
            this.initFilters1();
        },
        initFilters1() {
            this.filters1 = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                'name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
                'country.name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
                'representative': {value: null, matchMode: FilterMatchMode.IN},
                'date': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.DATE_IS}]},
                'balance': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
                'status': {operator: FilterOperator.OR, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
                'activity': {value: null, matchMode: FilterMatchMode.BETWEEN},
                'verified': {value: null, matchMode: FilterMatchMode.EQUALS}
            }
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep(.p-paginator) {
    .p-paginator-current {
        margin-left: auto;
    }
}

::v-deep(.p-progressbar) {
    height: .5rem;
    background-color: #D8DADC;

    .p-progressbar-value {
        background-color: #607D8B;
    }
}

::v-deep(.p-datepicker) {
    min-width: 25rem;

    td {
        font-weight: 400;
    }
}

::v-deep(.p-datatable.p-datatable-customers) {
    .p-datatable-header {
        padding: 1rem;
        text-align: left;
        font-size: 1.5rem;
    }

    .p-paginator {
        padding: 1rem;
    }

    .p-datatable-thead > tr > th {
        text-align: left;
    }

    .p-datatable-tbody > tr > td {
        cursor: auto;
    }

    .p-dropdown-label:not(.p-placeholder) {
        text-transform: uppercase;
    }
}
</style>

