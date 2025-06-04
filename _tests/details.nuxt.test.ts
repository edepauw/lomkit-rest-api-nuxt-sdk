import { describe, it, expect, vi, beforeEach } from 'vitest'
import details from '../src/runtime/methods/details'

const mockFetch = vi.fn()
global.fetch = mockFetch as any

const resourceUrl = 'http://localhost/api/products'
const requestInit = {
	headers: { Authorization: 'Bearer token' },
	credentials: 'include' as const,
}

const mockResponseData = {
	"data": {
		"actions": [
			{
				"name": "Send Welcome Notification",
				"uriKey": "send-welcome-notification",
				"fields": {
					"delay": [
						"required",
						"numeric"
					]
				},
				"meta": {
					"color": "#FFFFFF"
				},
				"is_standalone": false
			}
		],
		"instructions": [
			{
				"name": "Odd Even Id",
				"uriKey": "odd-even-id",
				"fields": {
					"type": [
						"in:odd,even"
					]
				},
				"meta": {
					"color": "#FFFFFF"
				}
			}
		],
		"fields": [
			"id",
			"name"
		],
		"limits": [
			1,
			10,
			25,
			50
		],
		"scopes": [
			"withTrashed"
		],
		"relations": [
			{
				"resources": [
					"App\\Rest\\Resources\\UserResource"
				],
				"relation": "posts",
				"constraints": {
					"required_on_creation": false,
					"prohibited_on_creation": false,
					"required_on_update": false,
					"prohibited_on_update": false
				},
				"name": "HasMany"
			}
		],
		"rules": {
			"all": { "id": ["numeric"] },
			"create": { "password": ["required"] },
			"update": { "password": ["prohibited"] }
		}
	}
}


function createFetchResponse(ok = true, data = mockResponseData, status = 200) {
	return {
		ok,
		status,
		json: vi.fn().mockResolvedValue(data),
	}
}

describe('details method', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should call fetch with correct arguments', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse())
		await details(resourceUrl, requestInit)
		expect(mockFetch).toHaveBeenCalledWith(
			resourceUrl,
			expect.objectContaining({
				method: 'GET',
				headers: expect.objectContaining({
					Authorization: 'Bearer token',
					'Content-Type': 'application/json',
					Accept: 'application/json',
				}),
				credentials: 'include',
			})
		)
	})

	it('should return the parsed response', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse())
		const result = await details(resourceUrl, requestInit)
		expect(result).toEqual(mockResponseData)
	})

	it('should throw an error if response is not ok', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse(false, { message: 'fail' } as any, 404))
		await expect(details(resourceUrl, requestInit)).rejects.toThrow('Error 404: fail')
	})
})
