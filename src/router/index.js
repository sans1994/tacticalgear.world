import { createWebHistory, createRouter } from "vue-router";

const routes = [
	{
		path: '/',
		name: 'homePage',
		component: () => import('../pages/HomePage.vue')
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router
