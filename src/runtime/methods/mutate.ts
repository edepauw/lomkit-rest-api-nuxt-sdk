import type { IMutateRequest, IMutateResponse } from "../types/mutate";

const mutate = async<T>(
	mutations: IMutateRequest<T>[],
	api: any
): Promise<IMutateResponse> => {

	const response = await api(`/mutate`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ mutate: mutations }),
	});
	return response;
};

export default mutate;
