import { CookieRef } from "nuxt/app";
import findOne from "./findOne";

import type { ISearchRequest } from "../types/search";

const findOneById = async <T>(
	url: string,
	token: CookieRef<string | null | undefined>,
	defaults: ISearchRequest<T> = {},
	id: number,
): Promise<T | null> => await findOne<T>(url, token, defaults, {
	filters: [
		{
			field: "id",
			value: id,
		},
	],
});

export default findOneById;
