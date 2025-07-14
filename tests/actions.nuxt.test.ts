import { describe, it, expect, vi, beforeEach } from 'vitest'
import actions from '../src/runtime/methods/actions'

const mockFetch = vi.fn()
global.fetch = mockFetch as any

const resourceUrl = 'http://localhost/api/products'
const requestInit = {
	headers: { Authorization: 'Bearer token' },
	credentials: 'include' as const,
}

const mockResponseData = {
	result: 'ok',
}

function createFetchResponse(ok = true, data = mockResponseData, status = 200) {
	return {
		ok,
		status,
		json: vi.fn().mockResolvedValue(data),
	}
}

const api = vi.fn(async (url: any, options: any) => (mockResponseData))

describe('actions method', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should call fetch with correct arguments', async () => {
		const query = {
			search: {
				filters: [
					{
						field: 'id',
						value: 2,
					}
				],
			}
		}

		await actions('sendEmails', query, api)

		expect(api).toHaveBeenCalledWith(
			"/actions/sendEmails",
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
		const result = await actions('sendEmails', {}, api)
		expect(result).toEqual(mockResponseData)
	})

	it('should throw an error if response is not ok', async () => {
		api.mockImplementationOnce(() => Promise.reject(new Error('Error 401: unauthorized')))
		await expect(actions('sendEmails', {}, api)).rejects.toThrow('Error 401: unauthorized')
	})
})
