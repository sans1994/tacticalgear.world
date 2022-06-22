import {setLevel, childNodesCheck} from "../../helpers";

let controller;

export default (app) => {
	let publicAxios = app.config.globalProperties.publicAxios;

	return {
		state: {
			servicesMenus: {
				activeItemPath: [],
				data: {},
				itemsParentById: new Map(),
				itemsBySlug: new Map()
			},
			servicesList: {
				data: {}
			},
			popularServices: {},
			service: {
				data: {}
			},
			search: {
				query: ''
			}
		},
		getters: {
			GET_SERVICES_MENUS: state => state.servicesMenus.data.services,
			GET_PACKAGE_SERVICES_MENUS: state => state.servicesMenus.data.packageServices,
			GET_SERVICES_MENUS_ACTIVE_ITEM_TITLE: state => {
				return state.servicesMenus?.activeItemPath?.length > 0 ?
					state.servicesMenus?.activeItemPath[state.servicesMenus?.activeItemPath?.length - 1].title : null;
			},
			GET_SERVICES_MENUS_ACTIVE_ITEM: state => {
				return state.servicesMenus?.activeItemPath?.length > 0 ?
					state.servicesMenus?.activeItemPath[state.servicesMenus?.activeItemPath?.length - 1] : null;
			},
			GET_SERVICES_MENUS_ACTIVE_ITEM_PATH: state => state.servicesMenus?.activeItemPath,
			GET_SERVICES_MENUS_ACTIVE_ITEM_S_PARENT_BY_ID: state => state.servicesMenus?.itemsParentById,
			GET_SERVICES_LIST_ITEMS: state => state.servicesList?.data?.content,
			GET_SERVICES_LIST: state => state.servicesList.data,
			GET_POPULAR_SERVICES: state => state.popularServices,
			GET_SERVICE: state => state.service.data,
			GET_SERVICE_PREPARATION: state => state.service.data.preparation
		},
		mutations: {
			MUT_SERVICES_MENUS: (state, data) => state.servicesMenus.data = data,
			MUT_SERVICES_MENUS_ITEMS_PARENT_BY_ID: (state, data) => state.servicesMenus.itemsParentById = data,
			MUT_SERVICES_MENUS_ITEMS_BY_SLUG: (state, data) => state.servicesMenus.itemsBySlug = data,
			MUT_SERVICES_MENUS_ACTIVE_ITEM_PATH: (state, data) => state.servicesMenus.activeItemPath = data,
			MUT_SERVICES_LIST: (state, data) => state.servicesList.data = data,
			MUT_POPULAR_SERVICES: (state, data) => state.popularServices = data,
			MUT_SERVICE: (state, data) => state.service.data = data,
			MUT_SEARCH_QUERY: (state, data) => state.search.query = data,
			MUT_SERVICE_PREPARATION: (state, data) => state.service.data.preparation = data

		},
		actions: {
			async ACT_GET_SERVICES_MENUS({ commit }) {
				return publicAxios
					.get('service/services/groups/enabled/tree/separated')
					.then(res => {
						setLevel(res.data.packageServices, 0)
						setLevel(res.data.services, 0)
						commit('MUT_SERVICES_MENUS', res.data)

						//

						const itemsParentById = new Map();
						const itemsBySlug = new Map();

						const processServiceGroups = (parentGroup, serviceGroups) => {
							serviceGroups.forEach(serviceGroup => {
								serviceGroup.key = serviceGroup.groupId;

								itemsParentById.set(serviceGroup.groupId, parentGroup);

								if (serviceGroup.slug) {
									itemsBySlug.set(serviceGroup.slug, serviceGroup);
								}

								serviceGroup.childNodes && processServiceGroups(serviceGroup, serviceGroup.childNodes);
							});
						};

						processServiceGroups(null, res.data.packageServices);
						processServiceGroups(null, res.data.services);

						commit('MUT_SERVICES_MENUS_ITEMS_PARENT_BY_ID', itemsParentById)
						commit('MUT_SERVICES_MENUS_ITEMS_BY_SLUG', itemsBySlug)
					})
			},
			ACT_GET_SERVICES_LIST({state, commit, rootState}, {paginate}) {
				let page = state.servicesList.data.page || 0,
					item = state.servicesMenus?.activeItemPath?.length > 0 ?
						state.servicesMenus?.activeItemPath[state.servicesMenus?.activeItemPath?.length - 1] : null,
					groupIds = childNodesCheck(item).map(el => el.groupId);

				if (page === undefined || page !== state.servicesList.data.totalPages) {

					if (item === undefined && !state.search.query.length || page === undefined && item?.groupId !== state.servicesMenus.activeItem[0] && !state.search.query.length) {
						commit('MUT_SERVICES_LIST', {})
					}

					if (controller) controller.abort();

					controller = new AbortController();

					publicAxios
						.post(`service/services/infos/settlements?page=${paginate ? page + 1 : 0}`,
							JSON.stringify({
								"settlementId": rootState.cities.cityId,
								"groupIds": groupIds,
								"query": state.search.query
							}),
							{
								signal: controller.signal,
							})
						.then(res => {
							if (paginate) {
								res.data.content = state?.servicesList?.data?.content?.concat(res.data.content) || res.data.content;
								commit('MUT_SERVICES_LIST', res.data)
							} else {
								commit('MUT_SERVICES_LIST', res.data)
							}
						})
						.catch(err => {
							if (err.name === 'AbortError') {
								console.log("CANCELED REQUEST")
							} else {
								console.log(err)
							}
						})
				}

			},
			ACT_GET_SERVICE({commit, rootState}, slug) {
				publicAxios
					.get(`service/services/infos/slug/${slug}`, {
						params: {
							"settlementId": rootState.cities.cityId
						}
					})
					.then(res => {
						let materials = [];
						res.data.analyses.forEach(item => {
							materials.push(item.materials[0].title)
						})
						res.data.materials = new Set(materials);
						res.data.materials = [...res.data.materials].join('. ') + '.';

						if(res.data.preparation) {
							publicAxios
								.get(`service/services/${res.data.id}/enabled/preparation`)
								.then(resPrep => {
									res.data.preparation = resPrep.data
								})
						}

						if (res.data.packageService) {
							publicAxios
								.get(`/content/services/groups/clients/services/infos`, {
									params: {
										"settlementId": rootState.cities.cityId,
										"serviceId": res.data.id
									}
								})
								.then(res3 => {
									res.data.clientsBuy = res3.data;
									commit('MUT_SERVICE', res.data);

								})
								.catch(err => console.log(err))
						} else {
							publicAxios
								.get(`service/services/infos/${res.data.id}/packages`, {
									params: {
										"settlementId": rootState.cities.cityId
									}
								})
								.then(res2 => {
									res.data.isPartOfPackets = res2.data
									commit('MUT_SERVICE', res.data);
								})
								.catch(err => console.log(err))
						}
					})
					.catch(err => console.log(err))
			},
			ACT_GET_POPULAR_SERVICES({commit, rootState}) {
				publicAxios
					.get(`/content/services/groups/popular/services/infos`, {
						params: {
							"settlementId": rootState.cities.cityId
						}
					})
					.then(res => {
						commit('MUT_POPULAR_SERVICES', res.data.content)
					})
			},
			ACT_MUT_SERVICE({commit}) {
				commit('MUT_SERVICE', {});
			},
			ACT_MUT_SERVICES_LIST({commit}) {
				commit('MUT_SERVICES_LIST', {});
			},
			ACT_MUT_SEARCH_QUERY({ commit }, value) {
				commit('MUT_SEARCH_QUERY', value);
			},
			ACT_MUT_SERVICES_MENUS_ACTIVE_ITEM({ state, commit }, slug) {
				const activeItemPath = [];

				let currentItem = state.servicesMenus.itemsBySlug.get(slug);
				while (currentItem) {
					activeItemPath.unshift(currentItem);
					currentItem = currentItem.groupId ?
						state.servicesMenus.itemsParentById.get(currentItem.groupId) : null;
				}

				commit('MUT_SERVICES_MENUS_ACTIVE_ITEM_PATH', activeItemPath)
			}
		}

	}
}
