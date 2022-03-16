import Vue from 'vue';
import App from './App.vue';
import store from './store/index';
import router from './router';

Vue.config.productionTip = false;

const moment = require('moment')
require('moment/locale/ru');
Vue.use(require('vue-moment'), {
	moment
});

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('.main')


