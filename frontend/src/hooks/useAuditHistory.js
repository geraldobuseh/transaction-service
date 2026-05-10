import { useCallback, useEffect, useState } from 'react';
import { getAuditErrorMessage, getTransactionHistory } from '../api/auditApi';

export function useAuditHistory(transactionId) {
  const [history, setHistory] = useState(null);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadHistory = useCallback(async () => {
    if (!transactionId) {
      setHistory(null);
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await getTransactionHistory(transactionId, { page, size: 10 });
      setHistory(response);
    } catch (requestError) {
      setError(getAuditErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [page, transactionId]);

  useEffect(() => {
    setPage(0);
  }, [transactionId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    page,
    setPage,
    isLoading,
    error,
    refreshHistory: loadHistory
  };
}
