import { defineNuxtPlugin } from "nuxt/app"
import { reactive } from "vue"

import { FetchOptions } from "./types/fetchOptions"


export default defineNuxtPlugin((NuxtApp) => {

	const state = reactive({
		FetchOptions: {} as FetchOptions
	})

	const setGlobalFetchOptions = (FetchOptions: FetchOptions) =>
		state.FetchOptions = FetchOptions;

	const getGlobalFetchOptions = () => state.FetchOptions

	return {
		provide: {
			restApiSDK: {
				setGlobalFetchOptions,
				getGlobalFetchOptions,
			}
		}
	}
})
