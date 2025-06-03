interface IApiClient {
	slug: string;
	url: string;
	requestInit?: RequestInit | (() => RequestInit);
	isDefault?: boolean;
}

export type { IApiClient };
