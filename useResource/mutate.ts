import { CookieRef } from "nuxt/app";
import type { IMutateRequest, IMutateResponse } from "../types/mutate";

const mutate = async <T>(
	url: string,
	token: CookieRef<string | null | undefined>,
	mutations: IMutateRequest<T>[]
): Promise<IMutateResponse> => {

	if (!token.value)
		throw new Error("Bearer token is not defined.");

	const response = await fetch(`${url}/mutate`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token.value}`,
		},
		body: JSON.stringify({ mutate: mutations }),
	});

	if (!response.ok) {
		const errorBody = await response.json();
		throw new Error(`Error ${response.status}: ${errorBody.message}`);
	}

	return await response.json();
};

export default mutate;
