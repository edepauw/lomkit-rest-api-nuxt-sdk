import { defineNuxtPlugin } from "nuxt/app"
import { reactive } from "vue"
import type { IApiClient } from "../types/apiClient"

export interface IlomkitRestClient {
	addApiClient: (apiClient: IApiClient) => void
	getApiClient: (slug?: string) => IApiClient | undefined
}

export default defineNuxtPlugin((nuxtApp) => {
	const state = reactive({
		apiClient: [] as IApiClient[]
	})

	const addApiClient = (apiClient: IApiClient) => {
		let isDefault = state.apiClient.length === 0 ? true : false
		const existingClient = state.apiClient.find((client) => client.slug === apiClient.slug)
		const existingDefaultClient = state.apiClient.find((client) => client.isDefault)

		if (existingClient)
			throw new Error(`API client with slug "${apiClient.slug}" already exists.`);

		if (existingDefaultClient && apiClient.isDefault) {
			isDefault = false
			console.warn(`Default API client "${existingDefaultClient.slug}" has been replaced by "${apiClient.slug}".`)
		}

		state.apiClient.push({
			requestInit: {},
			isDefault,
			...apiClient
		})
	}

	const getApiClient = (slug?: string) => {
		if (!slug) return state.apiClient.find((client) => client.isDefault)
		return state.apiClient.find((client) => client.slug === slug)
	}

	return {
		provide: {
			lomkitRestClient: {
				addApiClient,
				getApiClient,
			}
		}
	}
})
