const details = async (
	resourceUrl: string,
	{ headers, ...restRequestInit }: RequestInit,
) => {

	const response = await fetch(resourceUrl, {
		...restRequestInit,
		method: "GET",
		headers: {
			...headers,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	})

	if (!response.ok) {
		const errorBody = await response.json();
		throw new Error(`Error ${response.status}: ${errorBody.message}`);
	}

	return await response.json();
}

export default details;
