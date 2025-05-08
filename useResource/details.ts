import { CookieRef } from "nuxt/app";

const details = async (
	url: string,
	token: CookieRef<string | null | undefined>
) => {

	if (!token.value)
		throw new Error("Bearer token is not defined.");

	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token.value}`,
		},
	})

	if (!response.ok) {
		const errorBody = await response.json();
		throw new Error(`Error ${response.status}: ${errorBody.message}`);
	}

	return await response.json();
}

export default details;
