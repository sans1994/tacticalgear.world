import { createStore } from "vuex";
// import createPersistedState from "vuex-persistedstate";
import shops from './modules/shops.js'
export default app => {
    return createStore({
        state: {

        },
        getters: {

        },
        mutations: {

        },
        actions: {

        },
        // plugins: [createPersistedState({
        //     key: 'analysis',
        //     paths: ['analysis']
        // })],
        modules: {
            cities: shops(app),
        }
    })
}
