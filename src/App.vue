<template lang="pug">
	main.main(:class="{ 'has-aside-left' : getToken}")
		<Aside v-if="getToken" />
		<router-view></router-view>
</template>

<script>
import Aside from './components/layout/Aside';

import { mapGetters } from 'vuex';

export default {
	components: {
		Aside,
	},
	computed: {
		...mapGetters([
      'getUser',
			"getToken"
    ]),
		key() {
			return this.$route.meta.key !== undefined 
				? this.$route.meta.key : this.$route;
		},
	},
};
</script>

<style lang="stylus">
.main
	pos relative
</style>
	