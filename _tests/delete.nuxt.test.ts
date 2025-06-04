import { describe, it, expect, vi, beforeEach } from 'vitest'
import remove from '../src/runtime/methods/delete'

const mockFetch = vi.fn()
global.fetch = mockFetch as any

const resourceUrl = 'http://localhost/api/products'
const requestInit = {
	headers: { Authorization: 'Bearer token' },
	credentials: 'include' as const,
}

const mockResponseData = {
	deleted: [1, 2, 3],
}

function createFetchResponse(ok = true, data = mockResponseData, status = 200) {
	return {
		ok,
		status,
		json: vi.fn().mockResolvedValue(data),
	}
}

describe('remove method', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should call fetch with correct arguments', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse())
		const ids = [1, 2, 3]
		await remove(ids, resourceUrl, requestInit)
		expect(mockFetch).toHaveBeenCalledWith(
			resourceUrl,
			expect.objectContaining({
				method: 'DELETE',
				headers: expect.objectContaining({
					Authorization: 'Bearer token',
					'Content-Type': 'application/json',
					Accept: 'application/json',
				}),
				body: JSON.stringify({ resources: ids }),
			})
		)
	})

	it('should return the parsed response', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse())
		const ids = [1, 2, 3]
		const result = await remove(ids, resourceUrl, requestInit)
		expect(result).toEqual(mockResponseData)
	})

	it('should throw an error if response is not ok', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse(false, { message: 'fail' } as any, 400))
		const ids = [1]
		await expect(remove(ids, resourceUrl, requestInit)).rejects.toThrow('Error 400: fail')
	})
})
