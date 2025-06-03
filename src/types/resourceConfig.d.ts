import type { ISearchQuery } from "./search";

interface IResourcePreset<T> {
	apiClientSlug?: string;
	search?: ISearchQuery<T>;
}

export type { IResourcePreset };
