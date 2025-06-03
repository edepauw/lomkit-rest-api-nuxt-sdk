import { describe, it, expect, vi, beforeEach } from 'vitest'
import search from '../src/runtime/methods/search'

const mockFetch = vi.fn()
global.fetch = mockFetch as any

const resourceUrl = 'http://localhost/api/products'
const requestInit = {
	headers: { Authorization: 'Bearer token' },
	credentials: 'include' as const,
}

const mockResponseData: object = {
	data: [{ id: 1, name: 'Test' }],
	current_page: 1,
	per_page: 10,
	total: 1,
}

function createFetchResponse(ok = true, data = mockResponseData, status = 200) {
	return {
		ok,
		status,
		json: vi.fn().mockResolvedValue(data),
	}
}

describe('search method', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should call fetch with correct arguments', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse())
		await search({}, resourceUrl, requestInit)
		expect(mockFetch).toHaveBeenCalledWith(
			`${resourceUrl}/search`,
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({
					Authorization: 'Bearer token',
					'Content-Type': 'application/json',
					Accept: 'application/json',
				}),
				body: JSON.stringify({ search: {} }),
			})
		)
	})

	it('should return the parsed response', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse())
		const result = await search({}, resourceUrl, requestInit)
		expect(result.data).toEqual([{ id: 1, name: 'Test' }])
		expect(result.current_page).toBe(1)
	})

	it('should throw an error if response is not ok', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse(false, { message: 'fail' }, 400))
		await expect(search({}, resourceUrl, requestInit)).rejects.toThrow('Error 400: fail')
	})

	it('should provide nextPage, previousPage, and goToPage methods', async () => {
		mockFetch.mockResolvedValue(createFetchResponse())
		const result = await search({}, resourceUrl, requestInit)
		expect(typeof result.nextPage).toBe('function')
		expect(typeof result.previousPage).toBe('function')
		expect(typeof result.goToPage).toBe('function')
	})

	it('nextPage should call search with incremented page', async () => {
		mockFetch.mockResolvedValue(createFetchResponse())
		const result = await search({ page: 1 }, resourceUrl, requestInit)
		await result.nextPage()
		expect(mockFetch).toHaveBeenLastCalledWith(
			`${resourceUrl}/search`,
			expect.objectContaining({
				body: JSON.stringify({ search: { page: 2, limit: 10 } }),
			})
		)
	})

	it('previousPage should call search with decremented page', async () => {
		mockFetch.mockResolvedValue(createFetchResponse(true, {
			data: [{ id: 1, name: 'Test' }],
			current_page: 2,
			per_page: 10,
			total: 1,
		}))
		const result = await search({ page: 2 }, resourceUrl, requestInit)
		console.log(result)
		await result.previousPage()
		expect(mockFetch).toHaveBeenLastCalledWith(
			`${resourceUrl}/search`, {
			body: JSON.stringify({ search: { page: 1, limit: 10 } }),
			"credentials": "include",
			"headers": {
				"Accept": "application/json",
				"Authorization": "Bearer token",
				"Content-Type": "application/json",
			},
			"method": "POST",
		}
		)

	})

	it('goToPage should call search with specified page', async () => {
		mockFetch.mockResolvedValue(createFetchResponse())
		const result = await search({ page: 1 }, resourceUrl, requestInit)
		await result.goToPage(5)
		expect(mockFetch).toHaveBeenLastCalledWith(
			`${resourceUrl}/search`, {
			body: JSON.stringify({ search: { page: 5, limit: 10 } }),
			"credentials": "include",
			"headers": {
				"Accept": "application/json",
				"Authorization": "Bearer token",
				"Content-Type": "application/json",
			},
			"method": "POST",
		}
		)
	})
})
