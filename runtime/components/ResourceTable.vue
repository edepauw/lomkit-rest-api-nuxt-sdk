<template>
	<VDataTableServer
		:items-per-page-options="limitsOptions"
		:headers="headers"
		:items="searchRes.data"
		:loading="isLoading"
		:items-length="searchRes.total"
		@update:options="loadItems"
		v-model="selected"
		v-bind="$attrs"
	>
		<template v-for="(slotFn, name) in $slots" #[name]="slotProps">
			<component :is="slotFn" v-bind="slotProps" />
		</template>
	</VDataTableServer>
</template>

<script setup lang="ts">
	import reorderColumnsByPreference from "../utils/reorderColumnsByPreference";
	import type { ISearchResponse, IInclude } from "../../types/search";
	import type { IResourcePreset } from "../../types/resourceConfig";
	import type { IAdditionalHeaderProps } from "./ResourceTable";
	import { PropType, ref } from "vue";
	import useResource from "../useResource/index";

	const {
		order,
		excludes,
		searchProps,
		resourceName,
		itemsPerPage,
		additionalHeaders,
	} = defineProps({
		excludes: {
			type: Array,
			default: [],
		},
		order: {
			type: Array as PropType<string[]>,
			default: [],
		},
		resourceName: {
			type: String,
			required: true,
		},
		itemsPerPage: Number,
		additionalHeaders: {
			type: Array as PropType<IAdditionalHeaderProps[]>,
			default: [],
		},
		searchProps: {
			type: Object as PropType<IResourcePreset<any>>,
			required: true,
		},
	});
	const isLoading = ref(false);

	const resource = useResource(resourceName, searchProps);

	const details = await resource.details();

	const search = await resource.search({
		limit: itemsPerPage || details.data.limits[0],
	});
	const searchRes = defineModel("searchResponse", {
		type: Object as PropType<ISearchResponse<any>>,
		default: () => ({
			data: [],
			total: 0,
			links: {},
		}),
	});
	const selected = defineModel("selected", {
		type: Array as PropType<string[]>,
		default: () => [],
	});

	searchRes.value = search;

	const limitsOptions = details.data.limits.map((limit: number) => {
		return {
			title: limit,
			value: limit,
		};
	});

	const relations = details.data.relations.map((include: IInclude<any>) => {
		return include.relation;
	});

	const resourceHeaders = [...details.data.fields, ...relations]
		.filter((el) => {
			return !excludes?.includes(el);
		})
		.map((field) => {
			return {
				title: field,
				key: field,
			};
		});

	const headers = reorderColumnsByPreference(
		// @ts-ignore
		[...resourceHeaders, ...additionalHeaders],
		order
	);

	const loadItems = async ({ itemsPerPage, page, search, sortBy }: any) => {
		isLoading.value = true;
		resource
			.search({
				limit: itemsPerPage,
				page: page,
				sorts: sortBy.map(
					(sort: { key: string; order: "asc" | "desc" }) => ({
						field: sort.key,
						direction: sort.order,
					})
				),
			})
			.then((res) => {
				searchRes.value = res;
				isLoading.value = false;
			});
	};
</script>
