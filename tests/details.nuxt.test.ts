import { describe, it, expect, vi, beforeEach } from 'vitest'
import details from '../src/runtime/methods/details'

const mockFetch = vi.fn()
global.fetch = mockFetch as any

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

const api = vi.fn(async (url: any, options: any) => (mockResponseData))

describe('details method', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should call fetch with correct arguments', async () => {
		await details(api)
		expect(api).toHaveBeenCalledWith(
			"/",
			{
				"headers": {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
				"method": "GET",
			}
		)
	})

	it('should return the parsed response', async () => {
		const result = await details(api)
		expect(result).toEqual(mockResponseData)
	})

	it('should throw an error if response is not ok', async () => {
		api.mockImplementationOnce(() => Promise.reject(new Error('Error 404: fail')))
		await expect(details(api)).rejects.toThrow('Error 404: fail')
	})
})
