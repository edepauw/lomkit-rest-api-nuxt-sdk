import { describe, it, expect, vi, beforeEach } from 'vitest'
import search from '../src/runtime/methods/search'
import { ISearchQuery } from '../src/runtime/types/search'


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
const api = vi.fn(async (url: any, options: any) => (mockResponseData))

describe('search method', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	const query: { search: ISearchQuery<any> } = {
		search: {
			filters: [
				{
					field: 'id',
					value: 2,
				}
			],
			sorts: [{
				field: 'name',
				direction: 'asc'
			}]
		}
	}
	it('should call fetch with correct arguments', async () => {
		await search(query.search, api)

		expect(api).toHaveBeenCalledWith(
			"/search",
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
		const result = await search(query.search, api)
		expect(result).toEqual(mockResponseData)
	})

	it('should throw an error if response is not ok', async () => {
		api.mockImplementationOnce(() => Promise.reject(new Error('Error 401: unauthorized')))
		await expect(search(query.search, api)).rejects.toThrow('Error 401: unauthorized')
	})
})
