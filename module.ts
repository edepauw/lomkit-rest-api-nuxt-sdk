import { defineNuxtModule, createResolver, addImportsDir, addPlugin, addComponent } from '@nuxt/kit'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtModule({
	meta: {
		name: 'lomkit-rest-client',
		configKey: 'lomkitRestClient'
	},
	setup(_, nuxt) {
		const resolver = createResolver(import.meta.url);
		addImportsDir(resolver.resolve('./runtime/useResource'));
		addPlugin(resolver.resolve('./runtime/plugin'));
		addComponent({
			name: 'ResourceProvider', // name of the component to be used in vue templates
			filePath: resolver.resolve('./runtime/components/ResourceProvider.vue')
		})
		addComponent({
			name: 'ResourceTable', // name of the component to be used in vue templates
			filePath: resolver.resolve('./runtime/components/ResourceTable.vue')
		})
		nuxt.hook('prepare:types', ({ references }) => {
			references.push({
				path: resolver.resolve('./types/lomkitRestClient.d.ts')
			})
		})
		nuxt.options.build.transpile.push('vuetify')
		// Add Vuetify plugin to Nuxt config
		nuxt.options.modules.push((_options, nuxt) => {
			nuxt.hooks.hook('vite:extendConfig', (config) => {
				// @ts-expect-error
				config.plugins.push(vuetify({ autoImport: true }))
			})
		})
		nuxt.options.css.push('vuetify/styles')
		nuxt.options.css.push('@mdi/font/css/materialdesignicons.css')

		//@ts-expect-error
		nuxt.options.vite.vue.template = { transformAssetUrls }
	}
})
