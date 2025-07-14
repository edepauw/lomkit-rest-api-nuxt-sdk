import { defineNuxtModule, createResolver, addImportsDir, addPlugin } from '@nuxt/kit'

export default defineNuxtModule({
	meta: {
		name: 'lomkit-rest-client',
		configKey: 'restApiSdk'
	},
	setup(_, nuxt) {
		const resolver = createResolver(import.meta.url);
		addImportsDir(resolver.resolve('./runtime/defineResource'));
		addPlugin(resolver.resolve('./runtime/plugin'));

		nuxt.hook('prepare:types', (opts) => {
			const typesDir = './runtime/types/'
			if (!Array.isArray(opts.references)) {
				opts.references = []
			}
			opts.references.push({
				path: resolver.resolve(`${typesDir}restApiSdk.d.ts`)
			})
			opts.references.push({
				path: resolver.resolve(`${typesDir}actions.d.ts`)
			})
			opts.references.push({
				path: resolver.resolve(`${typesDir}search.d.ts`)
			})
			opts.references.push({
				path: resolver.resolve(`${typesDir}mutate.d.ts`)
			})
		})
		nuxt.options.imports.dirs?.push('./resources/**')
	}
})
