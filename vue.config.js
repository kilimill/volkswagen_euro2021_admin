const path = require('path')
module.exports = {
	chainWebpack: config => {
		const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
		types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)))

		const svgRule = config.module.rule('svg')
		svgRule.uses.clear()
		svgRule
			.use('babel-loader')
			.loader('babel-loader')
			.end()
			.use('vue-svg-loader')
			.loader('vue-svg-loader')
	},
	publicPath: process.env.NODE_ENV === 'production' ? '/admin/' : '/',
	css: {
		sourceMap: process.env.NODE_ENV == 'production' ? false : true
	},
	productionSourceMap: process.env.NODE_ENV == 'production' ? false : true,
	transpileDependencies: [],
	configureWebpack: config => {}
}

function addStyleResource(rule) {
	rule.use('style-resource')
		.loader('style-resources-loader')
		.options({
			patterns: [
				path.resolve(__dirname, './src/assets/styles/imports.styl'),
			],
		})
}
