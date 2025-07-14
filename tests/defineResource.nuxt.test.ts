import { describe, it, expect, vi, beforeEach } from "vitest";


// On mock les méthodes utilisées dans defineResource
vi.mock("../src/runtime/methods/details", () => ({
	default: vi.fn(() => Promise.resolve("details-called")),
}));
vi.mock("../src/runtime/methods/search", () => ({
	default: vi.fn(() => Promise.resolve("search-called")),
}));
vi.mock("../src/runtime/methods/mutate", () => ({
	default: vi.fn(() => Promise.resolve("mutate-called")),
}));
vi.mock("../src/runtime/methods/actions", () => ({
	default: vi.fn(() => Promise.resolve("actions-called")),
}));
vi.mock("../src/runtime/methods/delete", () => ({
	default: vi.fn(() => Promise.resolve("remove-called")),
}));

// Mock de $fetch.create
vi.mock("ofetch", () => ({
	$fetch: { create: () => "api-client" },
}));

// Mock de useNuxtApp
const mockGetGlobalFetchOptions = vi.fn(() => ({
	baseURL: "https://api.test",
	onRequest: undefined,
	onRequestError: undefined,
	onResponse: undefined,
	onResponseError: undefined,
}));
vi.mock("nuxt/app", () => ({
	useNuxtApp: () => ({
		$restApiSdk: {
			getGlobalFetchOptions: mockGetGlobalFetchOptions,
		},
	}),
}));

import defineResource from "../src/runtime/defineResource/index";


describe("defineResource", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	it("should return all methods", () => {
		const resource = defineResource("products")();
		expect(resource).toHaveProperty("mutate");
		expect(resource).toHaveProperty("details");
		expect(resource).toHaveProperty("search");
		expect(resource).toHaveProperty("actions");
		expect(resource).toHaveProperty("remove");
	});

	it("configure et appelle details correctement", async () => {
		const resource = defineResource("products")();
		const result = await resource.details();
		expect(result).toBe("details-called");
	});

	it("configure et appelle search correctement", async () => {
		const resource = defineResource("products")();
		const result = await resource.search();
		expect(result).toBe("search-called");
	});
});
