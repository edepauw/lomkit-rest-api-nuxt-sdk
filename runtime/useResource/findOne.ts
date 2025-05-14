import search from "./search";
import type { ISearchRequest } from "../../types/search";

const findOne = async <T>(
	searchConfig: ISearchRequest<T> = {},
	resourceUrl: string,
	requestInit: RequestInit,
): Promise<T | null> => (await search<T>(searchConfig, resourceUrl, requestInit)).data?.[0] ?? null;

export default findOne;
