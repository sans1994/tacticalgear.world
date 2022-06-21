import {createApp} from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import * as contentful from 'contentful'

// SCSS
import "./assets/sass/app.scss"
// SCSS
import './iconify/index.js';

// DIRECTIVES
// import Maska from "maska"
// DIRECTIVES

//COMPONENTS//
import { Icon } from '@iconify/vue'
import Multiselect from 'vue-multiselect'
// import IvButton from './components/Basic/IvButton.vue'
// import IvCheckbox from "./components/Basic/IvCheckbox.vue"
// import IvInput from "./components/Basic/IvInput.vue"
//COMPONENTS//

const api = contentful.createClient({
	space: '7zmt59h11u46',
	accessToken: 'Q8kkQy71bXSCu2ZzBCReT6t0ckUe9ZhEody-MkMF51o',
});

export const app = createApp(App);

// GLOBAL PROPERTIES
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$api = api;
// GLOBAL PROPERTIES

app.use(VueAxios, axios)
	.component('Icon', Icon)
	.component('Multiselect', Multiselect)
	// .component('IvButton', IvButton)
	// .component('IvCheckbox', IvCheckbox)
	// .component('IvInput', IvInput)
	.mount("#app");


