import { CookieRef } from "nuxt/app";

import type { ISearchRequest, ISearchResponse } from "../types/search";

const search = async<T>(
	url: string,
	token: CookieRef<string | null | undefined>,
	defaults: ISearchRequest<T> = {},
	request: ISearchRequest<T> = {}
): Promise<ISearchResponse<T>> => {

	if (!token.value)
		throw new Error("Bearer token is not defined.");

	const response = await fetch(`${url}/search`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token.value}`,
		},
		credentials: "include",
		body: request && JSON.stringify({ search: { ...defaults, ...request } }),
	});

	if (!response.ok) {
		const errorBody = await response.json();
		throw new Error(`Error ${response.status}: ${errorBody.message}`);
	}

	const ret = await response.json();

	return {
		...ret,
		/**
		 * @description Fetches the next page of the search results.
		 * @returns {Promise<ISearchResponse<T>>} The next page of the search results.
		 */
		nextPage: async (): Promise<ISearchResponse<T>> => await search<T>(url, token, defaults, { ...request, page: ret.current_page + 1, limit: ret.per_page }),

		/**
		 * @description Fetches the previous page of the search results.
		 * @returns {Promise<ISearchResponse<T>>} The previous page of the search results.
		 */
		previousPage: async (): Promise<ISearchResponse<T>> => await search<T>(url, token, defaults, { ...request, page: ret.current_page - 1, limit: ret.per_page }),

		/**
		 * @description Fetches a specific page of the search results.
		 * @param {number} page The page number to fetch.
		 * @returns {Promise<ISearchResponse<T>>} The specified page of the search results.
		 */
		goToPage: async (page: number): Promise<ISearchResponse<T>> => await search<T>(url, token, defaults, { ...request, page, limit: ret.per_page }),
	};
};

export default search;

