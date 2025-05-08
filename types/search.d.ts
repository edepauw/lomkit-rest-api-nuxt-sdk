interface ISearchRequest<T> {
  text?: IText;
  scopes?: IScopes[];
  filters?: IFilter<T>[];
  sorts?: ISort[];
  selects?: ISelect[];
  includes?: IInclude<T>[];
  aggregates?: IAggregate<T>[];
  instructions?: IInstruction[];
  pagination?: IPagination;
  gates?: IGate[];
  page?: number;
  limit?: number;
}

interface IText {
  value: string;
}

interface IScopes {
  name: string;
  parameters?: any[];
}

interface IFilter<T> {
  field?: string;
  operator?:
  | "="
  | "!="
  | ">"
  | "<"
  | ">="
  | "<="
  | "like"
  | "not like"
  | "in"
  | "not in";
  value?: string | number | boolean;
  type?: "and" | "or";
  nested?: IFilter<T>[];
}

interface ISort {
  field: string;
  direction?: "asc" | "desc";
}

interface ISelect {
  field: string;
}

interface IInclude<T> {
  relation: string;

  text?: IText;
  scopes?: IScopes[];
  filters?: IFilter<T>[];
  sorts?: ISort[];
  selects?: ISelect[];
  includes?: IInclude<T>[];
  aggregates?: IAggregate<T>[];
  instructions?: IInstruction[];
  pagination?: IPagination;
  gates?: IGate[];
  page?: number;
  limit?: number;
}

interface IAggregate<T> {
  relation: string;
  type: string;
  field?: string;
  filters?: IFilter<T>[];
}

interface IInstruction {
  name: string;
  fields?: any[];
}

interface IPagination {
  page: number;
  limit: number;
}

interface IGate {
  gates: any[];
}

//response
interface ISearchResponse<T> {
  current_page: number;
  data: T[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  meta: any;
}

export type {
  ISearchRequest,
  ISearchResponse,
  IText,
  IScopes,
  IFilter,
  ISort,
  ISelect,
  IInclude,
  IAggregate,
  IInstruction,
  IPagination,
  IGate,
};
