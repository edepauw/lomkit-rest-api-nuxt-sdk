import { FetchOptions } from "./fetchOptions";

export interface IlomkitRestClient {
	setGlobalFetchOptions: (options: FetchOptions) => void;
	getGlobalFetchOptions: () => FetchOptions;
}

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
