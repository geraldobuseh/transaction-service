import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTransactionHistory } from '../api/auditApi';
import {
  mapAuditEventToOperationalEvent,
  mapTransactionToOperationalEvent,
  sortOperationalEvents,
  summarizeOperationalEvents
} from '../utils/operationalEvents';

const POLL_INTERVAL_MS = 20000;

export function useOperationalEvents(transactions, canViewAudit) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);

  const loadEvents = useCallback(async () => {
    const recentTransactions = transactions
      .filter((transaction) => !transaction.isOptimistic)
      .slice(0, 6);

    if (recentTransactions.length === 0) {
      setEvents([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (!canViewAudit) {
        setEvents(
          sortOperationalEvents(
            recentTransactions.map((transaction) => mapTransactionToOperationalEvent(transaction))
          )
        );
        setLastRefreshedAt(new Date().toISOString());
        return;
      }

      const histories = await Promise.all(
        recentTransactions.map((transaction) =>
          getTransactionHistory(transaction.id, { page: 0, size: 6 })
        )
      );

      const auditEvents = histories.flatMap((history) =>
        history.events.map((event) => mapAuditEventToOperationalEvent(event, history.correlationId))
      );

      setEvents(sortOperationalEvents(auditEvents).slice(0, 18));
      setLastRefreshedAt(new Date().toISOString());
    } catch {
      setError('Event activity is temporarily unavailable.');
    } finally {
      setIsLoading(false);
    }
  }, [canViewAudit, transactions]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    const interval = window.setInterval(loadEvents, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [loadEvents]);

  const metrics = useMemo(() => summarizeOperationalEvents(events), [events]);

  return {
    events,
    metrics,
    isLoading,
    error,
    lastRefreshedAt,
    refreshEvents: loadEvents
  };
}
