import axiosClient from './axiosClient';
import { getApiErrorMessage } from './apiError';

export async function getTransactions(filters = {}) {
  const response = await axiosClient.get('/api/transactions', {
    params: cleanFilters(filters)
  });
  return Array.isArray(response.data) ? response.data : [];
}

export async function createTransaction(transaction) {
  const response = await axiosClient.post('/api/transactions', {
    userId: transaction.userId.trim(),
    amount: Number(transaction.amount),
    type: transaction.type,
    description: transaction.description.trim()
  });

  return response.data;
}

function cleanFilters(filters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );
}

export { getApiErrorMessage };
