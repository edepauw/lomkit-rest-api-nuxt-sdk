const restore = async (
	resourceIds: number[],
	api: any
) => {

	const response = await api('/restore', {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ resources: resourceIds }),
	});

	return await response;
};

export default restore;
