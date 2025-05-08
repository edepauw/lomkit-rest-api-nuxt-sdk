import { useCookie, useRuntimeConfig } from "nuxt/app";

import search from "./search";
import mutate from "./mutate";
import details from "./details";
import actions from "./actions";
import remove from "./delete";
import findOneById from "./findOneById";
import findOne from "./findOne";

import type { IMutateRequest, IMutateResponse } from "../types/mutate";
import type { ISearchRequest, ISearchResponse } from "../types/search";
import { IActionRequest, IActionResponse } from "../types/actions";

/**
 * @author Eliott Depauw
 * @description A composable function to interact with a REST API.
 * @param {string} ressource The name of the resource to interact with.
 * @param {object} defaults *Optional* Default parameters.
 * @returns {object} An object containing methods to interact with the API.
 * @example
 *   const productsResource = useResource<IProduct>("products", {
 *     search: {
 *       includes: [{ relation: "category" }],
 *       limit: 10
 *     }
 *   });
 */
const useResource = <T>(ressource: string, defaults: { search: ISearchRequest<T> } = { search: {} }) => {

	const config = useRuntimeConfig().public.lomkitRestClient as {
		tokenName: string;
		apiUrl: string;
	}

	const apiUrl = config.apiUrl;

	if (!apiUrl)
		throw new Error("API URL is not defined in the configuration.");

	const token = useCookie(config.tokenName)

	const url = `${apiUrl}/api/${ressource}`;

	return {
		/**
		 * @description Fetches the details of a resource.
		 * @returns {Promise<any>} The details of the resource.
		 */
		details: async (): Promise<any> => await details(url, token),

		/**
		 * @description Fetches a single resource.
		 * @param {ISearchRequest<T>} [request={}] The search request parameters.
		 * @returns {Promise<T | null>} The resource object or null if not found.
		 * @example
		 *   const product = await productsResource.findOne({ filters: [{ field: "id", operator: "=", value: 1 }] });
		 */
		findOne: async (request: ISearchRequest<T> = {}): Promise<T | null> => await findOne<T>(url, token, defaults.search, request),

		/**
		 * @description Fetches a single resource by its ID.
		 * @param {number} id  The ID of the resource.
		 * @returns {Promise<T | null>}  The resource object or null if not found.
		 * @example
		 *  const product = await productsResource.findOneById(1);
		 */
		findOneById: async (id: number): Promise<T | null> => await findOneById<T>(url, token, defaults.search, id),

		/**
		 * @description Searches for resources.
		 * @param {ISearchRequest<T>} [request={}] The search request parameters.
		 * @returns {Promise<ISearchResponse<T>>} An array of resources matching the search criteria.
		 * @example
		 *   const { data, total } = await productsResource.search({
		 *     filters: [{ field: "category.name", value: "electronics" }]
		 *   });
		 */
		search: async (request: ISearchRequest<T> = {}): Promise<ISearchResponse<T>> => await search<T>(url, token, defaults.search, request),

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
		mutate: async (mutations: IMutateRequest<T>[]): Promise<IMutateResponse> => await mutate<T>(url, token, mutations),

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
		actions: async (actionName: string, params: IActionRequest<T>): Promise<IActionResponse> => await actions(url, token, actionName, params),

		/**
		 * @description Removes resources by their IDs.
		 * @param {number[]} ids The IDs of the resources to remove.
		 * @returns {Promise<any>} The result of the remove operation.
		 */
		remove: async (ids: number[]): Promise<any> => await remove(url, token, ids),
	};
};

export default useResource;
