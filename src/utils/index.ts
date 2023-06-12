import { Request } from '@hapi/hapi';
import {
  DEFAULT_ERROR_MESSAGE,
  DEFAULT_ERROR_STATUS_CODE,
  DEFAULT_SUCCESS_MESSAGE,
  DEFAULT_SUCCESS_STATUS_CODE,
} from '../constants/response';
import { TPaginatedData } from '../types/common/paginated-data.type';
import { TPaginationField } from '../types/common/pagination-field.type';
import { TPaginationQuery } from '../types/common/pagination-query.type';
import { TResponse } from '../types/common/response.type';

export function pageToOffset(
  paginateQuery: TPaginationQuery
): TPaginationField {
  const { limit, page } = paginateQuery;
  const offset = (page - 1) * limit;

  return {
    limit,
    offset,
  };
}

export function constructPaginationQuery(
  limit: number,
  page: number
): TPaginationQuery {
  return {
    limit,
    page,
  };
}

export function constructResponse<TData = any>(
  isSuccess = true,
  globalSuccess = true,
  data: TData,
  customStatusCode?: number,
  customMessage?: string,
  errors?: string[]
): TResponse<TData> {
  const statusCode = customStatusCode
    ? customStatusCode
    : isSuccess
    ? DEFAULT_SUCCESS_STATUS_CODE
    : DEFAULT_ERROR_STATUS_CODE;

  const message = customMessage
    ? customMessage
    : isSuccess
    ? DEFAULT_SUCCESS_MESSAGE
    : DEFAULT_ERROR_MESSAGE;

  return {
    globalSuccess,
    success: isSuccess,
    statusCode,
    message,
    data,
    errors: errors && errors.length ? errors : undefined,
  };
}

export function constructPaginatedData<TData = any>(
  data: TData[],
  totalCount: number,
  paginationQuery: TPaginationQuery
): TPaginatedData {
  const response: TPaginatedData = {
    count: data.length,
    totalCount,
    currentPage: paginationQuery.page,
    totalPages: Math.ceil(totalCount / paginationQuery.limit),
    data,
  };

  return response;
}
