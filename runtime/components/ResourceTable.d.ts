export interface IAdditionalHeaderProps {
	key?:
	| (string & {})
	| 'data-table-group'
	| 'data-table-select'
	| 'data-table-expand'
	| undefined
	value?: any
	title?: string | undefined
	fixed?: boolean | undefined
	align?: 'end' | 'start' | 'center' | undefined
	width?: string | number | undefined
	minWidth?: string | number | undefined
	maxWidth?: string | number | undefined
	nowrap?: boolean | undefined
	headerProps?: { [x: string]: any } | undefined
	cellProps?: any | undefined;
	sortable?: boolean | undefined
	sort?: any | undefined
	sortRaw?: any | undefined
	filter?: any | undefined
	children?: readonly any[] | undefined
}

