import { CookieRef } from "nuxt/app";

const remove = async (
	url: string,
	token: CookieRef<string | null | undefined>,
	resourceIds: number[]
) => {

	if (!token.value)
		throw new Error("Bearer token is not defined.");

	const response = await fetch(`${url}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
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
