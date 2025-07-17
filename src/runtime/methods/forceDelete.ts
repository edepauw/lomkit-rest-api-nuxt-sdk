const forceDelete = async (
	resourceIds: number[],
	api: any
) => {

	const response = await api('/force', {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ resources: resourceIds }),
	});

	return await response;
};

export default forceDelete;
