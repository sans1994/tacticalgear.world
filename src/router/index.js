import { createRouter, createWebHistory } from "vue-router";
import MapBlock from "../components/MapBlock.vue";
import DataTableFilterDemo from "../components/DataTableFilterDemo.vue";

export const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: 'HomePage',
			component: () => import('../pages/HomePage.vue'),
			children: [
				{
					path: '/map',
					components: {
						tabsMap: MapBlock
					},
				},
				{
					path: '/list',
					components: {
						tabsList: DataTableFilterDemo
					}
				}
			]
		}
	]
});
