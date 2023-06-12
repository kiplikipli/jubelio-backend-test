export type TPaginatedData<TData = any> = {
  count: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  data: TData;
};
