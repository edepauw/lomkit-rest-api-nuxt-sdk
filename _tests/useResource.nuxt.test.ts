import { describe, it, expect, vi, beforeEach } from 'vitest'
import useResource from '../runtime/useResource/index'
import * as detailsModule from '../runtime/methods/details'
import * as findOneModule from '../runtime/methods/findOne'
import * as searchModule from '../runtime/methods/search'
import * as mutateModule from '../runtime/methods/mutate'
import * as actionsModule from '../runtime/methods/actions'
import * as removeModule from '../runtime/methods/delete'

const mockGetApiClient: any = vi.fn(() => ({
	url: 'http://localhost:3000',
	requestInit: () => ({
		headers: {
			'Content-Type': 'application/json',
		},
	})
}))
vi.mock('nuxt/app', () => ({
	useNuxtApp: () => ({
		$lomkitRestClient: {
			getApiClient: mockGetApiClient,
		},
	}),
}))

vi.mock('../runtime/methods/details', () => ({
	default: vi.fn(() => ({ data: {} })),
}))
vi.mock('../runtime/methods/findOne', () => ({
	default: vi.fn(() => ({})),
}))
vi.mock('../runtime/methods/search', () => ({
	default: vi.fn(() => ({ data: [], total: 0 })),
}))
vi.mock('../runtime/methods/mutate', () => ({
	default: vi.fn(() => ({ success: true })),
}))
vi.mock('../runtime/methods/actions', () => ({
	default: vi.fn(() => ({ result: 'ok' })),
}))
vi.mock('../runtime/methods/delete', () => ({
	default: vi.fn(() => ({ deleted: true })),
}))

describe('useResource composable', () => {
	const resourceUrl = 'http://localhost:3000/api/products'
	const requestInit = {
		headers: {
			'Content-Type': 'application/json',
		},
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should be defined', () => {
		expect(useResource).toBeDefined()
	})

	it('should return a resource object', () => {
		const resource = useResource('products')
		expect(resource).toBeDefined()
		expect(resource).toHaveProperty('details')
		expect(resource).toHaveProperty('findOne')
		expect(resource).toHaveProperty('search')
		expect(resource).toHaveProperty('mutate')
		expect(resource).toHaveProperty('remove')
		expect(resource).toHaveProperty('actions')
		expect(resource).toHaveProperty('findOneById')
	})

	it('should call details with correct arguments', async () => {
		const resource = useResource('products')
		await resource.details()
		expect(detailsModule.default).toHaveBeenCalledWith(resourceUrl, requestInit)
	})

	it('should call findOne with correct arguments', async () => {
		const resource = useResource('products', { search: { limit: 5 } })
		const request = { filters: [{ field: 'id', value: 1 }] }
		await resource.findOne(request)
		expect(findOneModule.default).toHaveBeenCalledWith(
			{ limit: 5, ...request },
			resourceUrl,
			requestInit
		)
	})

	it('should call findOneById with correct arguments', async () => {
		const resource = useResource('products', { search: { limit: 2 } })
		await resource.findOneById(42, { includes: [{ relation: 'category' }] })
		expect(findOneModule.default).toHaveBeenCalledWith(
			{
				filters: [{ field: 'id', value: 42 }],
				limit: 2,
				includes: [{ relation: 'category' }],
			},
			resourceUrl,
			requestInit
		)
	})

	it('should call search with correct arguments', async () => {
		const resource = useResource('products', { search: { limit: 10 } })
		const request = { filters: [{ field: 'name', value: 'test' }] }
		await resource.search(request)
		expect(searchModule.default).toHaveBeenCalledWith(
			{ limit: 10, ...request },
			resourceUrl,
			requestInit
		)
	})

	it('should call mutate with correct arguments', async () => {
		const resource = useResource('products')
		const mutations = [
			{ operation: "update" as const, key: 1, attributes: { name: 'new' } },
		]
		await resource.mutate(mutations)
		expect(mutateModule.default).toHaveBeenCalledWith(mutations, resourceUrl, requestInit)
	})

	it('should call actions with correct arguments', async () => {
		const resource = useResource('products')
		const params = { search: { filters: [{ field: 'id', value: 1 }] } }
		await resource.actions('validate', params)
		expect(actionsModule.default).toHaveBeenCalledWith('validate', params, resourceUrl, requestInit)
	})

	it('should call remove with correct arguments', async () => {
		const resource = useResource('products')
		const ids = [1, 2, 3]
		await resource.remove(ids)
		expect(removeModule.default).toHaveBeenCalledWith(ids, resourceUrl, requestInit)
	})

	it('should call details with correct arguments when requestInit is an object', async () => {
		mockGetApiClient.mockReturnValueOnce({
			url: 'http://localhost:3000',
			requestInit: {
				headers: {
					'Content-Type': 'text/plain',
				},
			},
		})
		const resource = useResource('products')
		await resource.details()
		expect(detailsModule.default).toHaveBeenCalledWith(resourceUrl, { headers: { 'Content-Type': 'text/plain' } })
	})

	it('should call details with correct arguments when no requestInit is provided', async () => {
		mockGetApiClient.mockReturnValueOnce({
			url: 'http://localhost:3000',
		})
		const resource = useResource('products')
		await resource.details()
		expect(detailsModule.default).toHaveBeenCalledWith(resourceUrl, {})
	})

	it('should throw an error if the resource name is not provided', () => {
		expect(() => useResource('')).toThrow('Resource name is required')
	}
	)
})
