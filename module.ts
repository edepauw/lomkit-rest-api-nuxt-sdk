import { defineNuxtModule, createResolver, addImportsDir, addPlugin } from '@nuxt/kit'

export default defineNuxtModule({
	meta: {
		name: 'lomkit-rest-client',
		configKey: 'lomkitRestClient'
	},
	setup(_, nuxt) {
		const resolver = createResolver(import.meta.url);
		addImportsDir(resolver.resolve('./runtime/useResource'));
		addPlugin(resolver.resolve('./runtime/plugin'));

		nuxt.hook('prepare:types', ({ references }) => {
			references.push({
				path: resolver.resolve('./types/lomkitRestClient.d.ts')
			})
		})
	}
})
