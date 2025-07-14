import { describe, it, expect, vi, beforeEach } from 'vitest'
import remove from '../src/runtime/methods/delete'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)
const resourceUrl = 'http://localhost/api/products'
const requestInit = {
	headers: { Authorization: 'Bearer token' },
	credentials: 'include' as const,
}

const mockResponseData = {
	deleted: [1, 2, 3],
}

const api = vi.fn(async (url: any, options: any) => (mockResponseData))

describe('delete method', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should call fetch with correct arguments', async () => {
		await remove([1, 2, 3], api)
		expect(api).toHaveBeenCalledWith(
			"/",
			{
				"headers": {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
				"method": "DELETE",
				"body": JSON.stringify({ resources: [1, 2, 3] }),
			}
		)
	})

	it('should return the parsed response', async () => {
		const result = await remove([1, 2, 3], api)
		expect(result).toEqual(mockResponseData)
	})

	it('should throw an error if response is not ok', async () => {
		api.mockImplementationOnce(() => Promise.reject(new Error('Error 401: unauthorized')))
		await expect(remove([1, 2, 3], api)).rejects.toThrow('Error 401: unauthorized')
	})
})
