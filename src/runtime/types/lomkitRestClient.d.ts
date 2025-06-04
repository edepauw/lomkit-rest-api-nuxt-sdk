import type { IlomkitRestClient } from '../src/runtime/plugin'

declare module '#app' {
	interface NuxtApp {
		$lomkitRestClient: IlomkitRestClient
	}
}

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$lomkitRestClient: IlomkitRestClient
	}
}
