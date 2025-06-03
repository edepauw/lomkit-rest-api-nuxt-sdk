import { describe, it, expect, vi, beforeEach } from 'vitest'
import mutate from '../src/runtime/methods/mutate'

const mockFetch = vi.fn()
global.fetch = mockFetch as any

const resourceUrl = 'http://localhost/api/products'
const requestInit = {
	headers: { Authorization: 'Bearer token' },
	credentials: 'include' as const,
}

const mockResponseData = {
	created: [
		72979
	],
	updated: []
}
function createFetchResponse(ok = true, data = mockResponseData, status = 200) {
	return {
		ok,
		status,
		json: vi.fn().mockResolvedValue(data),
	}
}

describe('mutate method', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should call fetch with correct arguments', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse())
		const mutations = [{ operation: 'update', key: 1, attributes: { name: 'Test' } }] as any[]

		await mutate(mutations, resourceUrl, requestInit)
		expect(mockFetch).toHaveBeenCalledWith(
			`${resourceUrl}/mutate`,
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({
					Authorization: 'Bearer token',
					'Content-Type': 'application/json',
					Accept: 'application/json',
				}),
				body: JSON.stringify({ mutate: mutations }),
			})
		)
	})

	it('should return the parsed response', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse())
		const mutations = [{ operation: 'update', key: 1, attributes: { name: 'Test' } }] as any[]
		const result = await mutate(mutations, resourceUrl, requestInit)
		expect(result).toEqual(mockResponseData)
	})

	it('should throw an error if response is not ok', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse(false, { message: 'fail' } as any, 400))
		const mutations = [{ operation: 'update', key: 1, attributes: { name: 'Test' } }] as any[]
		await expect(mutate(mutations, resourceUrl, requestInit)).rejects.toThrow('Error 400: fail')
	})
})
