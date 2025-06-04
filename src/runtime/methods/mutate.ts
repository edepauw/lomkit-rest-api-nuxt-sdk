import type { IMutateRequest, IMutateResponse } from "../types/mutate";

const mutate = async <T>(
	mutations: IMutateRequest<T>[],
	resourceUrl: string,
	{ headers, ...restRequestInit }: RequestInit,
): Promise<IMutateResponse> => {

	const response = await fetch(`${resourceUrl}/mutate`, {
		...restRequestInit,
		method: "POST",
		headers: {
			...headers,
			"Content-Type": "application/json",
			Accept: "application/json",
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
