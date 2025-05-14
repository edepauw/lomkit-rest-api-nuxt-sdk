import type { ISearchRequest } from "./search";

interface IResourceConfig<T> {
	apiClientSlug?: string;
	searchConfig?: ISearchRequest<T>;
}

export type { IResourceConfig };
