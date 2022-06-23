export default (app) => {
	let api = app.config.globalProperties.$api;

	return {
		state: {
			shops: [],
			countries: []
		},
		getters: {
			GET_SHOPS: state => state.shops,
			GET_COUNTRIES: state => state.countries
		},
		mutations: {
			MUT_SHOPS: (state, data) => state.shops = data,
			MUT_COUNTRIES: (state, data) => state.countries = data
		},
		actions: {
			ACT_GET_SHOPS({state, commit}) {
				api.getEntries({
					content_type: 'shop'
				})
					.then(entries => {
						commit('MUT_SHOPS', entries.items)

					})
					.catch(err => console.log(err))
			},
			ACT_GET_COUNTRIES({state, commit}) {
				api.getEntries({
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
						console.log(countries);
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
			}
		}

	}
}
