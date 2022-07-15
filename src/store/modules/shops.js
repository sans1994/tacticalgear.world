export default (app) => {
	let api = app.config.globalProperties.$api;

	return {
		state: {
			shops: [],
			countries: [],
			data: [],
			favourites: []
		},
		getters: {
			GET_SHOPS: state => state.shops,
			GET_COUNTRIES: state => state.countries,
			GET_DATA: state => state.data,
			GET_FAVOURITES: state => state.favourites
		},
		mutations: {
			MUT_SHOPS: (state, data) => state.shops = data,
			MUT_COUNTRIES: (state, data) => state.countries = data,
			MUT_DATA: (state, data) => state.data = data,
			MUT_FAVOURITES: (state, data) => state.favourites = data
		},
		actions: {
			async ACT_GET_SHOPS({commit}) {
				await api.getEntries({
					content_type: 'shop'
				})
					.then(entries => {
						commit('MUT_SHOPS', entries.items)
						let newData = [];
						entries.items.forEach(el => {
							el.fields.id = el.sys.id;
							el.fields.country = el.fields.country.fields
							newData.push(el.fields)
						})
						commit('MUT_DATA', newData)
					})
					.catch(err => console.log(err))
			},
			async ACT_GET_COUNTRIES({state, commit}) {
				await api.getEntries({
					content_type: 'country'
				})
					.then(entries => {
						let countries = [];

						entries.items.forEach(item => {
							countries.push({
								name: item.fields.name,
								id: item.sys.id
							})
						})
						commit('MUT_COUNTRIES', countries)
					})
					.catch(err => console.log(err))
			},
			ACT_GET_SHOPS_BY_COUNTRY({state, commit}, countryId) {
				api.getEntries({
					'fields.country.sys.id': countryId,
					content_type: 'shop'
				})
					.then(entries => {
						commit('MUT_SHOPS', entries.items)
					})
					.catch(err => console.log(err))
			},
			ACT_TOGGLE_FAVOURITE({state, commit}, data) {
				let favourites = state.favourites;
				if (state.favourites.some(el => el.id === data.id)) {
					favourites = state.favourites.filter(el => el.id !== data.id)
				} else {
					favourites.push(data)
				}
				commit('MUT_FAVOURITES', favourites)

				console.log(favourites);
			},
			ACT_CHECK_IS_FAVOURITE({state}, id) {
				return state.favourites.some(el => el.id === id)
			},
			ACT_GET_FAVOURITES({state, commit}) {

			}
		}

	}
}
