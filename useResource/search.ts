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

	return await response.json();
};

export default search;
