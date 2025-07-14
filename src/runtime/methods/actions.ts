import type { IActionRequest, IActionResponse } from "../types/actions";

const actions = async <T>(
	actionName: string,
	params: IActionRequest<T>,
	api: any
): Promise<IActionResponse> => {

	const response = await api(`/actions/${actionName}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(params),
	})

	return response;
};

export default actions;
