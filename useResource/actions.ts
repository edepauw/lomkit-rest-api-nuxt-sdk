import { CookieRef } from "nuxt/app";

import type { IActionRequest, IActionResponse } from "../types/actions";

const actions = async <T>(
	url: string,
	token: CookieRef<string | null | undefined>,
	actionName: string,
	params: IActionRequest<T>
): Promise<IActionResponse> => {

	if (!token.value)
		throw new Error("Bearer token is not defined.");

	const response = await fetch(`${url}/actions/${actionName}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(params),
	})

	if (!response.ok) {
		const errorBody = await response.json();
		throw new Error(`Error ${response.status}: ${errorBody.message}`);
	}

	return await response.json();
};

export default actions;
