import type { ISearchQuery, ISearchResponse } from "../types/search";

const search = async <T>(
	searchQuery: ISearchQuery<T> = {},
	resourceUrl: string,
	{ headers, ...restRequestInit }: RequestInit,
): Promise<ISearchResponse<T>> => {
	const response = await fetch(`${resourceUrl}/search`, {
		...restRequestInit,
		method: "POST",
		headers: {
			...headers,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ search: searchQuery }),
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
		nextPage: async (): Promise<ISearchResponse<T>> => await search<T>(
			{ ...searchQuery, page: ret.current_page + 1, limit: ret.per_page },
			resourceUrl,
			{ headers, ...restRequestInit }
		),

		/**
		 * @description Fetches the previous page of the search results.
		 * @returns {Promise<ISearchResponse<T>>} The previous page of the search results.
		 */
		previousPage: async (): Promise<ISearchResponse<T>> => await search<T>(
			{ ...search, page: ret.current_page - 1, limit: ret.per_page },
			resourceUrl,
			{ headers, ...restRequestInit }
		),

		/**
		 * @description Fetches a specific page of the search results.
		 * @param {number} page The page number to fetch.
		 * @returns {Promise<ISearchResponse<T>>} The specified page of the search results.
		 */
		goToPage: async (page: number): Promise<ISearchResponse<T>> => await search<T>(
			{ ...search, page, limit: ret.per_page },
			resourceUrl,
			{ headers, ...restRequestInit }
		),
	};
};

export default search;

