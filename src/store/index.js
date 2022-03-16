import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";


import mutations from './mutations';
import actions from './actions';
import getters from './getters';
// import matches from './modules/matches';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		mobile: (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1),
		user: null,
		token: null,
		matches: [],
		users: [],
		checks: [],
		iter: {
			0: [],
			1: []
		},
	},
	mutations,
	// matches,
	actions,
	getters,
	plugins: [createPersistedState()],
});
