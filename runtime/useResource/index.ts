import { useNuxtApp } from "nuxt/app";

import search from "./search";
import mutate from "./mutate";
import details from "./details";
import actions from "./actions";
import remove from "./delete";
import findOne from "./findOne";

import type { IMutateRequest, IMutateResponse } from "../../types/mutate";
import type { IFindOneByIdRequest, ISearchRequest, ISearchResponse } from "../../types/search";
import type { IActionRequest, IActionResponse } from "../../types/actions";
import type { IResourceConfig } from "../../types/resourceConfig";

/**
 * @author Eliott Depauw
 * @description A composable function to interact with a REST API.
 * @param {string} ressourceName The name of the resource to interact with.
 * @example
 *   const productsResource = useResource<IProduct>("products", {
 *     search: {
 *       includes: [{ relation: "category" }],
 *       limit: 10
 *     }
 *   });
 */
const useResource = <T>(ressourceName: string, { apiClientSlug, searchConfig = {} }: IResourceConfig<T>) => {
	// @ts-ignore $lomkitRestClient will be defined at runTime
	const apiClient = useNuxtApp().$lomkitRestClient.getApiClient(apiClientSlug);

	const resourceUrl = apiClient.url + "/api/" + ressourceName;

	let requestInit =
		typeof apiClient.requestInit === "function" ?
			apiClient.requestInit() : (apiClient.requestInit ?? {});

	return {
		/**
		 * @description Fetches the details of a resource.
		 * @returns {Promise<any>} The details of the resource.
		 */
		details: async (): Promise<any> => await details(resourceUrl, requestInit),

		/**
		 * @description Fetches a single resource.
		 * @param {ISearchRequest<T>} [request={}] The search request parameters.
		 * @returns {Promise<T | null>} The resource object or null if not found.
		 * @example
		 *   const product = await productsResource.findOne({ filters: [{ field: "id", operator: "=", value: 1 }] });
		 */
		findOne: async (request: ISearchRequest<T> = {}): Promise<T | null> => await findOne<T>({ ...searchConfig, ...request }, resourceUrl, requestInit),

		/**
		 * @description Fetches a single resource by its ID.
		 * @param {number} id  The ID of the resource.
		 * @param {IFindOneByIdRequest<T>} request The search request parameters WITHOUT filters.
		 * @returns {Promise<T | null>}  The resource object or null if not found.
		 * @example
		 *  const product = await productsResource.findOneById(1, { includes: [{ relation: "category" }]}
		 */
		findOneById: async (id: number, request: IFindOneByIdRequest<T> = {}): Promise<T | null> => await findOne<T>({ filters: [{ field: 'id', value: id }], ...searchConfig, ...request }, resourceUrl, requestInit),

		/**
		 * @description Searches for resources.
		 * @param {ISearchRequest<T>} [request={}] The search request parameters.
		 * @returns {Promise<ISearchResponse<T>>} An array of resources matching the search criteria.
		 * @example
		 *   const { data, total } = await productsResource.search({
		 *     filters: [{ field: "category.name", value: "electronics" }]
		 *   });
		 */
		search: async (request: ISearchRequest<T> = {}): Promise<ISearchResponse<T>> => await search<T>({ ...searchConfig, ...request }, resourceUrl, requestInit),

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
		mutate: async (mutations: IMutateRequest<T>[]): Promise<IMutateResponse> => await mutate<T>(mutations, resourceUrl, requestInit),

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
		actions: async (actionName: string, params: IActionRequest<T>): Promise<IActionResponse> => await actions(actionName, params, resourceUrl, requestInit),

		/**
		 * @description Removes resources by their IDs.
		 * @param {number[]} ids The IDs of the resources to remove.
		 * @returns {Promise<any>} The result of the remove operation.
		 */
		remove: async (ids: number[]): Promise<any> => await remove(ids, resourceUrl, requestInit),
	};
};

export default useResource;
