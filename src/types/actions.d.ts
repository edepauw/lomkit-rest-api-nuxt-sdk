import { ISearchQuery } from "./search";

interface IActionField {
	name: string;
	value: string | number | boolean | null;
}

interface IActionRequest<T> {
	fields?: IActionField[];
	search?: ISearchQuery<T>;
}

interface IActionResponse {
	data: {
		impacted: number;
	};
}

export type { IActionResponse, IActionRequest, IActionField };
