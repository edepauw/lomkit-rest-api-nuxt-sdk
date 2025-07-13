
interface FetchOptions<R extends ResponseType = ResponseType, T = any> extends Omit<RequestInit, "body">, FetchHooks<T, R> {
	baseURL?: string;
	body?: RequestInit["body"] | Record<string, any>;
	ignoreResponseError?: boolean;
	params?: Record<string, any>;
	query?: Record<string, any>;
	parseResponse?: (responseText: string) => any;
	responseType?: R;
	/**
	 * @experimental Set to "half" to enable duplex streaming.
	 * Will be automatically set to "half" when using a ReadableStream as body.
	 * @see https://fetch.spec.whatwg.org/#enumdef-requestduplex
	 */
	duplex?: "half" | undefined;
	/**
	 * Only supported in Node.js >= 18 using undici
	 *
	 * @see https://undici.nodejs.org/#/docs/api/Dispatcher
	 */
	dispatcher?: InstanceType<any>;
	/**
	 * Only supported older Node.js versions using node-fetch-native polyfill.
	 */
	agent?: unknown;
	/** timeout in milliseconds */
	timeout?: number;
	retry?: number | false;
	/** Delay between retries in milliseconds. */
	retryDelay?: number | ((context: FetchContext<T, R>) => number);
	/** Default is [408, 409, 425, 429, 500, 502, 503, 504] */
	retryStatusCodes?: number[];
}
interface ResolvedFetchOptions<R extends ResponseType = ResponseType, T = any> extends FetchOptions<R, T> {
	headers: Headers;
}

interface FetchContext<T = any, R extends ResponseType = ResponseType> {
	request: FetchRequest;
	options: ResolvedFetchOptions<R>;
	response?: FetchResponse<T>;
	error?: Error;
}
type MaybePromise<T> = T | Promise<T>;
type MaybeArray<T> = T | T[];
type FetchHook<C extends FetchContext = FetchContext> = (context: C) => MaybePromise<void>;
interface FetchHooks<T = any, R extends ResponseType = ResponseType> {
	onRequest?: MaybeArray<FetchHook<FetchContext<T, R>>>;
	onRequestError?: MaybeArray<FetchHook<FetchContext<T, R> & {
		error: Error;
	}>>;
	onResponse?: MaybeArray<FetchHook<FetchContext<T, R> & {
		response: FetchResponse<T>;
	}>>;
	onResponseError?: MaybeArray<FetchHook<FetchContext<T, R> & {
		response: FetchResponse<T>;
	}>>;
}
interface FetchResponse<T> extends Response {
	_data?: T;
}
type FetchRequest = RequestInfo;

export type {
	FetchOptions,
	FetchContext,
	FetchResponse
};
