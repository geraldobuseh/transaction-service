import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createTransaction,
  getApiErrorMessage,
  getTransactions
} from '../api/transactionsApi';
import { emptyTransactionFilters } from '../utils/transactionFilters';

const TRANSACTION_POLL_INTERVAL_MS = 25000;

function sortTransactions(transactions) {
  return [...transactions].sort((first, second) => {
    const firstTime = new Date(first.createdAt || 0).getTime();
    const secondTime = new Date(second.createdAt || 0).getTime();

    if (firstTime !== secondTime) {
      return secondTime - firstTime;
    }

    return Number(second.id || 0) - Number(first.id || 0);
  });
}

function upsertTransaction(transactions, nextTransaction, optimisticId) {
  const withoutOptimistic = transactions.filter(
    (transaction) => transaction.id !== optimisticId
  );
  const alreadyExists = withoutOptimistic.some(
    (transaction) => transaction.id === nextTransaction.id
  );

  if (alreadyExists) {
    return withoutOptimistic.map((transaction) =>
      transaction.id === nextTransaction.id ? nextTransaction : transaction
    );
  }

  return [nextTransaction, ...withoutOptimistic];
}

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState(emptyTransactionFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const loadTransactions = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) {
      setIsLoading(true);
    }

    setError('');

    try {
      const data = await getTransactions(filters);
      setTransactions(sortTransactions(data));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      if (!quiet) {
        setIsLoading(false);
      }
    }
  }, [filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      loadTransactions({ quiet: true });
    }, TRANSACTION_POLL_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [loadTransactions]);

  const createNewTransaction = useCallback(
    async (payload) => {
      setIsSubmitting(true);
      setSubmitError('');
      const optimisticTransaction = {
        id: `pending-${Date.now()}`,
        userId: payload.userId.trim(),
        amount: Number(payload.amount),
        type: payload.type,
        status: 'PENDING',
        description: payload.description.trim(),
        createdAt: new Date().toISOString(),
        isOptimistic: true
      };

      setTransactions((current) => sortTransactions([optimisticTransaction, ...current]));

      try {
        const created = await createTransaction(payload);
        setTransactions((current) =>
          sortTransactions(upsertTransaction(current, created, optimisticTransaction.id))
        );
        await loadTransactions({ quiet: true });
        return true;
      } catch (requestError) {
        setTransactions((current) =>
          current.filter((transaction) => transaction.id !== optimisticTransaction.id)
        );
        setSubmitError(getApiErrorMessage(requestError));
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [loadTransactions]
  );

  const metrics = useMemo(() => {
    const approved = transactions.filter(
      (transaction) => transaction.status === 'APPROVED'
    ).length;
    const flagged = transactions.filter(
      (transaction) => transaction.status === 'FLAGGED'
    ).length;
    const pending = transactions.filter(
      (transaction) => transaction.status === 'PENDING'
    ).length;
    const volume = transactions.reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0
    );

    return {
      total: transactions.length,
      approved,
      flagged,
      pending,
      volume
    };
  }, [transactions]);

  return {
    transactions,
    filters,
    setFilters,
    resetFilters: () => setFilters(emptyTransactionFilters),
    metrics,
    isLoading,
    isSubmitting,
    error,
    submitError,
    refreshTransactions: loadTransactions,
    createNewTransaction,
    clearSubmitError: () => setSubmitError('')
  };
}
