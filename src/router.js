import Vue from 'vue';
import Router from 'vue-router';

import Dashboard from './views/Dashboard';
import Login from './views/Login';

// countruies
import Contries from './views/countries/Index.vue';
import Country from './views/countries/Elem.vue';

// matches
import Matches from './views/matches/Index.vue';
import Match from './views/matches/Elem.vue';

// fans
import Fans from './views/fans/Index.vue';
import Fan from './views/fans/Elem.vue';

// news
import News from './views/news/Index.vue';
import NewsPage from './views/news/Elem.vue';

// support
import Support from './views/support/Index.vue';

import store from './store/index';

Vue.use(Router);

let routes = [
	{
		path: '/',
		component: Dashboard,
		meta: {
			title: 'Главная',
		},
	},
	{
		path: '/login',
		component: Login,
		name: 'login',
		meta: {
			title: 'Авторизация',
		},
	},
	{
		path: '/contries',
		component: Contries,
		name: 'contries',
		meta: {
			title: 'Страны',
		},
	},
	{
		path: '/contries/:id',
		component: Country,
		name: 'country',
		props: true,
		meta: {
			title: 'Просмотр страны',
		},
	},
	{
		path: '/matches',
		component: Matches,
		name: 'matches',
		meta: {
			title: 'Матчи',
		},
	},
	{
		path: '/matches/:id',
		component: Match,
		name: 'match',
		props: true,
		meta: {
			title: 'Матч',
		},
	},
	{
		path: '/fans',
		component: Fans,
		name: 'fans',
		meta: {
			title: 'Фанаты',
		},
	},
	{
		path: '/fans/:id',
		component: Fan,
		name: 'fan',
		props: true,
		meta: {
			title: 'Данные фаната',
		},
	},
	{
		path: '/news',
		component: News,
		name: 'news',
		meta: {
			title: 'Новости',
		},
	},
	{
		path: '/news/:id',
		component: NewsPage,
		name: 'newspage',
		props: true,
		meta: {
			title: 'Детали новости',
		},
	},
	{
		path: '/support',
		component: Support,
		name: 'support',
		meta: {
			title: 'Поддержка',
		},
	},
];

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, _from, next) => {
	if (to.name === 'login' || store.state.token) {
		next();
	} else {
		next('/login');
	}
});
// eslint-disable-next-line no-unused-vars
router.afterEach((to, _from) => {
  Vue.nextTick(() => {
    document.title = to.meta.title;
  })
});

export default router
