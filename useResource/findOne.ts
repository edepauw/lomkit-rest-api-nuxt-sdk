import { CookieRef } from "nuxt/app";
import search from "./search";

import type { ISearchRequest } from "../types/search";

const findOne = async <T>(
	url: string,
	token: CookieRef<string | null | undefined>,
	defaults: ISearchRequest<T> = {},
	request: ISearchRequest<T> = {}
): Promise<T | null> => (await search<T>(url, token, defaults, { ...request, limit: 1 })).data?.[0] ?? null;

export default findOne;
