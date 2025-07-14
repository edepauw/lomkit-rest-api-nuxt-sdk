import { FetchOptions } from "./fetchOptions";

export interface IrestApiSdk {
	setGlobalFetchOptions: (options: FetchOptions) => void;
	getGlobalFetchOptions: () => FetchOptions;
}

declare module '#app' {
	interface NuxtApp {
		$restApiSdk: IrestApiSdk
	}
}

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$restApiSdk: IrestApiSdk
	}
}
