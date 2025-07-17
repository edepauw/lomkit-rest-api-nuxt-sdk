import { useNuxtApp } from "nuxt/app";

import search from "../methods/search";
import mutate from "../methods/mutate";
import details from "../methods/details";
import actions from "../methods/actions";
import remove from "../methods/delete";
import forceDelete from "../methods/forceDelete";
import restore from "../methods/restore";
import { $fetch } from 'ofetch'


import type { IMutateRequest, IMutateResponse } from "../types/mutate";
import type { ISearchQuery, ISearchResponse } from "../types/search";
import type { IActionRequest, IActionResponse } from "../types/actions";
import type { IResourcePreset } from "../types/resourceConfig";
import type { FetchOptions } from "../types/fetchOptions";


const combineHooks = (globalHook, specificHook) => {
	return async (arg) => {
		if (typeof globalHook === "function") await globalHook(arg);
		if (typeof specificHook === "function") await specificHook(arg);
	};
}


const joinUrl = (base: string, path: string) =>
	base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");


/**
 * @author Eliott Depauw
 * @description A function to define a resource to interact with a REST API.
 * @param {string} resourceName The name of the resource to interact with.
 * @example
 *   const productsResource = defineResource<IProduct>("products", {
 *     search: {
 *       includes: [{ relation: "category" }],
 *       limit: 10
 *     }
 *   });
 */
const defineResource = <T>(resourceName: string, preset: IResourcePreset<T> = {}) => (additionalPreset: IResourcePreset<T> = {}) => {

	// @ts-ignore
	const globalFetchOptions = useNuxtApp().$restApiSdk.getGlobalFetchOptions() as FetchOptions | null;

	if (!resourceName)
		throw new Error("Resource name is required");

	const presets = { ...preset, ...additionalPreset };

	const resourceUrl = joinUrl(globalFetchOptions?.baseURL ?? "", `/${resourceName}`);

	// @ts-ignore
	const api = $fetch.create({
		...globalFetchOptions,
		baseURL: resourceUrl,
		onRequest: combineHooks(globalFetchOptions?.onRequest, presets.onRequest),
		onRequestError: combineHooks(globalFetchOptions?.onRequestError, presets.onRequestError),
		onResponse: combineHooks(globalFetchOptions?.onResponse, presets.onResponse),
		onResponseError: combineHooks(globalFetchOptions?.onResponseError, presets.onResponseError),
	})


	return {
		/**
		 * @description Fetches the details of a resource.
		 * @returns {Promise<any>} The details of the resource.
		 */
		details: (): Promise<any> => details(api),

		/**
		 * @description Searches for resources.
		 * @param {ISearchQuery<T>} [request={}] The search request parameters.
		 * @returns {Promise<ISearchResponse<T>>} An array of resources matching the search criteria.
		 * @example
		 *   const { data, total } = await productsResource.search({
		 *     filters: [{ field: "category.name", value: "electronics" }]
		 *   });
		 */
		search: (request: ISearchQuery<T> = {}): Promise<ISearchResponse<T>> => search({ ...presets.search, ...request }, api),

		/**
		 * @description Mutates resources.
		 * @param {IMutateRequest<T>[]} mutations The mutations to apply to the resources.
		 * @returns {Promise<IMutateResponse>} The result of the mutation operation.
		 * @example
		 *   const response = await productsResource.mutate([
		 *     {
		 *       operation: "update",
		 *       key: 2,
		 *       attributes: { "price": 19.99 },
		 *     },
		 *   ])
		 */
		mutate: (mutations: IMutateRequest<T>[]): Promise<IMutateResponse> => mutate(mutations, api),
		/**
		 * @description Executes an action on a resource.
		 * @param {string} actionName The name of the action to execute.
		 * @param {object} params The parameters for the action.
		 * @returns {Promise<IActionResponse>} The result of the action.
		 * @example
		 *   const response = await cartsResource.actions("validate-cart", {
		 *     search: {
		 *       filters: [{ field: "id", value: 1 }],
		 *     },
		 *   });
		 */
		actions: (actionName: string, params: IActionRequest<T>): Promise<IActionResponse> => actions(actionName, params, api),

		/**
		 * @description Removes resources by their IDs.
		 * @param {number[]} ids The IDs of the resources to remove.
		 * @returns {Promise<any>} The result of the remove operation.
		 */
		remove: (ids: number[]): Promise<any> => remove(ids, api),

		/**
		 * @description Force delete resources by their IDs.
		 * @param {number[]} ids The IDs of the resources to force delete.
		 * @returns {Promise<any>} The result of the force delete operation.
		 */
		forceDelete: (ids: number[]): Promise<any> => forceDelete(ids, api),


		/**
		 * @description Restore resources by their IDs.
		 * @param {number[]} ids The IDs of the resources to restore.
		 * @returns {Promise<any>} The result of the restore operation.
		 */
		restore: (ids: number[]): Promise<any> => restore(ids, api),
	};
};

export default defineResource;
