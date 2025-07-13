import { FetchOptions } from "./fetchOptions";
import type { ISearchQuery } from "./search";

interface IResourcePreset<T> extends FetchOptions {
	search?: ISearchQuery<T>;
}


export type { IResourcePreset };
