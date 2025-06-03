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

describe('actions method', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})
	const params = {
		fields: [
			{ name: "expires_at", value: "2023-04-29" }
		]
	}
	it('should call fetch with correct arguments', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse())

		await actions('myAction', params, resourceUrl, requestInit)
		expect(mockFetch).toHaveBeenCalledWith(
			`${resourceUrl}/actions/myAction`,
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({
					Authorization: 'Bearer token',
					'Content-Type': 'application/json',
					Accept: 'application/json',
				}),
				body: JSON.stringify(params),
				credentials: 'include',
			})
		)
	})

	it('should call fetch with correct params for send-welcome-notification', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse())

		const userResourceUrl = 'http://localhost/api/users'
		await actions('send-welcome-notification', params, userResourceUrl, requestInit)
		expect(mockFetch).toHaveBeenCalledWith(
			`${userResourceUrl}/actions/send-welcome-notification`,
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({
					Authorization: 'Bearer token',
					'Content-Type': 'application/json',
					Accept: 'application/json',
				}),
				body: JSON.stringify(params),
				credentials: 'include',
			})
		)
	})

	it('should return the parsed response', async () => {
		mockFetch.mockResolvedValueOnce(createFetchResponse())

		const result = await actions('myAction', params, resourceUrl, requestInit)
		expect(result).toEqual(mockResponseData)
	})

	it('should throw an error if response is not ok', async () => {

		mockFetch.mockResolvedValueOnce(createFetchResponse(false, { message: 'fail' } as any, 400))

		await expect(actions('myAction', params, resourceUrl, requestInit)).rejects.toThrow('Error 400: fail')
	})
})
