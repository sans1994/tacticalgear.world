import { createRouter, createWebHistory } from "vue-router";
import MapPage from "../pages/MapPage.vue";
import ListPage from "../pages/ListPage.vue";
import MainLayout from '../layouts/MainLayout.vue'
export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: 'MainLayout',
			component: () => import('../layouts/MainLayout.vue'),
			children: [
				{
					path: '/',
					components: {
						tabsMap: MapPage
					},
				},
				{
					path: '/list',
					components: {
						tabsList: ListPage
					}
				}
			]
		}
	]
});
