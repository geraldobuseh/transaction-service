import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/useAuth';

export function usePlatformStatus() {
  const { isAuthenticated } = useAuth();
  const [lastApiSignal, setLastApiSignal] = useState(null);

  useEffect(() => {
    const handleApiSignal = (event) => {
      setLastApiSignal(event.detail);
    };

    window.addEventListener('transact:api-signal', handleApiSignal);
    return () => window.removeEventListener('transact:api-signal', handleApiSignal);
  }, []);

  return useMemo(
    () => ({
      apiOnline: lastApiSignal ? lastApiSignal.status < 500 : null,
      kafkaVisible: lastApiSignal ? true : null,
      sqlVisible: lastApiSignal ? true : null,
      authenticated: isAuthenticated,
      lastCorrelationId: lastApiSignal?.correlationId || '',
      lastEndpoint: lastApiSignal?.url || '',
      lastStatus: lastApiSignal?.status || null,
      lastSeenAt: lastApiSignal?.timestamp || null
    }),
    [isAuthenticated, lastApiSignal]
  );
}
