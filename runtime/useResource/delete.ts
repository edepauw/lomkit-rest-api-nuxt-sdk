const remove = async (
	resourceIds: number[],
	resourceUrl: string,
	{ headers, ...restRequestInit }: RequestInit,
) => {

	const response = await fetch(resourceUrl, {
		...restRequestInit,
		method: "DELETE",
		headers: {
			...headers,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ resources: resourceIds }),
	});

	if (!response.ok) {
		const errorBody = await response.json();
		throw new Error(`Error ${response.status}: ${errorBody.message}`);
	}

	return await response.json();
};

export default remove;
