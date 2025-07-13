import { describe, it, expect, vi, beforeEach } from 'vitest'
import mutate from '../src/runtime/methods/mutate'
import { IMutateRequest } from '../src/runtime/types/mutate'

const mockFetch = vi.fn()
global.fetch = mockFetch as any

const mockResponseData = {
	created: [
		72979
	],
	updated: []
}
const api = vi.fn(async (url: any, options: any) => (mockResponseData))

describe('mutate method', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	const query: { mutate: IMutateRequest<any>[] } = {
		mutate: [{
			operation: 'create',
			attributes: {
				name: 'Test Product',
				price: 100
			}
		}]
	}

	it('should call fetch with correct arguments', async () => {
		await mutate(query.mutate, api)

		expect(api).toHaveBeenCalledWith(
			"/mutate",
			{
				"headers": {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
				"method": "POST",
				"body": JSON.stringify(query),
			}
		)
	})

	it('should return the parsed response', async () => {
		const result = await mutate(query.mutate, api)
		expect(result).toEqual(mockResponseData)
	})

	it('should throw an error if response is not ok', async () => {
		api.mockImplementationOnce(() => Promise.reject(new Error('Error 401: unauthorized')))
		await expect(mutate(query.mutate, api)).rejects.toThrow('Error 401: unauthorized')
	})
})
