import search from "./search";
import type { ISearchQuery } from "../types/search";

const findOne = async <T>(
	searchQuery: ISearchQuery<T> = {},
	resourceUrl: string,
	requestInit: RequestInit,
): Promise<T | null> => (await search<T>(searchQuery, resourceUrl, requestInit)).data?.[0] ?? null;

export default findOne;
