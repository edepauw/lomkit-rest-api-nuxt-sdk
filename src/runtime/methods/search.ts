import type { ISearchQuery, ISearchResponse } from "../types/search";

const search = async <T>(
	searchQuery: ISearchQuery<T> = {},
	api: any
): Promise<ISearchResponse<T>> => {
	const response = await api(`/search`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ search: searchQuery }),
	});

	return response;
};

export default search;

