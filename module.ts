import { defineNuxtModule, createResolver, addImportsDir } from '@nuxt/kit'

export default defineNuxtModule({
	meta: {
		name: 'lomkit-rest-client',
		configKey: 'lomkitRestClient'
	},
	defaults: {
		tokenName: 'auth_token',
		apiUrl: 'http://localhost/api'
	},
	setup(options, nuxt) {
		// Injecter la config dans runtimeConfig.public pour y accéder côté client
		nuxt.options.runtimeConfig.public.lomkitRestClient = {
			...options
		}
		console.log('lomkit-rest-client module loaded with options:', options)
		const resolver = createResolver(import.meta.url)
		addImportsDir(resolver.resolve('./useResource'))
	}
})
