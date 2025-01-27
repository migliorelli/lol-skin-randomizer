export interface ApiError {
  code: string;
  message: string;
}

export type ApiPromise<DataType> = Promise<
  { data: DataType; error: null } | { data: null; error: ApiError }
>;
