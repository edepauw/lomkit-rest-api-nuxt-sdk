interface IMutateRelationRequest {
  operation: "create" | "update" | "attach" | "detach" | "sync" | "toggle";
  attributes?: any;
  key?: number | string;
  without_detaching?: boolean;
  pivot?: any;
  relations?: {
    [key: string]: IMutateRelationRequest[] | IMutateRelationRequest;
  };
}

interface IMutateRequest<T> {
  operation: "create" | "update" | "attach" | "detach" | "sync" | "toggle";
  attributes?: T;
  key?: number | string;
  without_detaching?: boolean;
  relations?: {
    [key: string]: IMutateRelationRequest[] | IMutateRelationRequest;
  };
}

interface IMutateResponse {
  created: number[];
  updated: number[];
}

export type { IMutateRequest, IMutateResponse, IMutateRelationRequest };
