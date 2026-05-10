import axiosClient from './axiosClient';
import { getApiErrorMessage } from './transactionsApi';

export async function getTransactionHistory(transactionId, pagination = {}) {
  const response = await axiosClient.get(`/api/audit/transaction/${transactionId}`, {
    params: {
      page: pagination.page ?? 0,
      size: pagination.size ?? 10,
      sort: pagination.sort || 'createdAt,desc'
    }
  });

  return {
    transactionId,
    events: Array.isArray(response.data?.content) ? response.data.content : [],
    correlationId: response.headers?.['x-correlation-id'] || '',
    page: response.data?.page ?? 0,
    size: response.data?.size ?? 10,
    totalElements: response.data?.totalElements ?? 0,
    totalPages: response.data?.totalPages ?? 0,
    first: Boolean(response.data?.first),
    last: Boolean(response.data?.last)
  };
}

export function getAuditErrorMessage(error) {
  if (error.response?.status === 403) {
    return 'Your role does not allow access to transaction audit history.';
  }

  return getApiErrorMessage(error);
}
