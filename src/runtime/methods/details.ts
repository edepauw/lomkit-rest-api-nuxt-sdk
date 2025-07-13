const details = async (
	api: any,
) => {

	const response = await api('/', {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	})

	return await response;
}

export default details;
