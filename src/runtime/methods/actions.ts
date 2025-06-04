import type { IActionRequest, IActionResponse } from "../types/actions";

const actions = async <T>(
	actionName: string,
	params: IActionRequest<T>,
	resourceUrl: string,
	{ headers, ...restRequestInit }: RequestInit,
): Promise<IActionResponse> => {

	const response = await fetch(`${resourceUrl}/actions/${actionName}`, {
		...restRequestInit,
		method: "POST",
		headers: {
			...headers,
			"Content-Type": "application/json",
			Accept: "application/json",
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
