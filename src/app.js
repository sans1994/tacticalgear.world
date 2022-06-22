import {createApp} from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import * as contentful from 'contentful'

// SCSS
import "./assets/sass/app.scss"
// SCSS
import './iconify/index.js';

//COMPONENTS//
import { Icon } from '@iconify/vue'
import Multiselect from 'vue-multiselect'
// import IvButton from './components/Basic/IvButton.vue'
// import IvCheckbox from "./components/Basic/IvCheckbox.vue"
// import IvInput from "./components/Basic/IvInput.vue"
//COMPONENTS//

const api = contentful.createClient({
	space: import.meta.env.VITE_API_SPACE,
	accessToken: import.meta.env.VITE_API_TOKEN,
});

export const app = createApp(App);

// GLOBAL PROPERTIES
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$api = api;
// GLOBAL PROPERTIES

app.use(VueAxios, axios)
	.use(router)
	.component('Icon', Icon)
	.component('Multiselect', Multiselect)
	// .component('IvButton', IvButton)
	// .component('IvCheckbox', IvCheckbox)
	// .component('IvInput', IvInput)
	.mount("#app");


