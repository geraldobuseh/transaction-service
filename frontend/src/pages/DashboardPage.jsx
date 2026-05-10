import { useMemo, useRef, useState } from 'react';
import AuditTimeline from '../components/AuditTimeline';
import BuilderIntro from '../components/BuilderIntro';
import DashboardShell from '../components/DashboardShell';
import Hero from '../components/Hero';
import OperationalMetrics from '../components/OperationalMetrics';
import PlatformStatusBar from '../components/PlatformStatusBar';
import TransactionForm from '../components/TransactionForm';
import TransactionFilters from '../components/TransactionFilters';
import TransactionTable from '../components/TransactionTable';
import { useAuth } from '../auth/useAuth';
import { useOperationalEvents } from '../hooks/useOperationalEvents';
import { usePlatformStatus } from '../hooks/usePlatformStatus';
import { useTransactions } from '../hooks/useTransactions';

const transactionCreateRoles = new Set(['ADMIN', 'ANALYST']);
const auditViewRoles = new Set(['ADMIN', 'ANALYST']);

export default function DashboardPage() {
  const { role } = useAuth();
  const [selectedAuditTransactionId, setSelectedAuditTransactionId] = useState(null);
  const auditPanelRef = useRef(null);
  const canCreateTransactions = transactionCreateRoles.has(role);
  const canViewAudit = auditViewRoles.has(role);
  const platformStatus = usePlatformStatus();
  const {
    transactions,
    filters,
    setFilters,
    resetFilters,
    metrics,
    isLoading,
    isSubmitting,
    error,
    submitError,
    refreshTransactions,
    createNewTransaction,
    clearSubmitError
  } = useTransactions();
  const {
    events: operationalEvents,
    metrics: eventMetrics
  } = useOperationalEvents(transactions, canViewAudit);
  const eventCountsByTransaction = useMemo(
    () =>
      operationalEvents.reduce((counts, event) => {
        counts[event.transactionId] = (counts[event.transactionId] || 0) + 1;
        return counts;
      }, {}),
    [operationalEvents]
  );
  const openAuditHistory = (transactionId) => {
    setSelectedAuditTransactionId(transactionId);
    window.setTimeout(() => {
      auditPanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 120);
  };

  return (
    <DashboardShell>
      <main>
        <Hero />
        <PlatformStatusBar status={platformStatus} />
        <BuilderIntro />

        <section
          className={`mx-auto grid w-full max-w-7xl items-start gap-6 px-5 pb-16 pt-6 sm:px-8 lg:pb-24 ${
            canCreateTransactions
              ? 'lg:grid-cols-[minmax(360px,400px)_minmax(0,1fr)]'
              : 'lg:grid-cols-1'
          }`}
        >
          <div className="min-w-0 lg:col-span-full">
            <OperationalMetrics
              transactionMetrics={metrics}
              eventMetrics={eventMetrics}
            />
          </div>

          {canCreateTransactions && (
            <div className="min-w-0">
              <TransactionForm
                onCreate={createNewTransaction}
                isSubmitting={isSubmitting}
                submitError={submitError}
                onClearError={clearSubmitError}
              />
            </div>
          )}

          <div className="min-w-0">
            <div className="mb-6">
              <TransactionFilters
                filters={filters}
                onChange={setFilters}
                onReset={resetFilters}
                isLoading={isLoading}
              />
            </div>
            <TransactionTable
              transactions={transactions}
              metrics={metrics}
              isLoading={isLoading}
              error={error}
              onRetry={refreshTransactions}
              canDelete={role === 'ADMIN'}
              canViewAudit={canViewAudit}
              onViewAudit={openAuditHistory}
              eventCountsByTransaction={eventCountsByTransaction}
            />
          </div>

          {canViewAudit && (
            <div ref={auditPanelRef} className="scroll-mt-6 min-w-0 lg:col-span-full">
              <AuditTimeline
                transactionId={selectedAuditTransactionId}
                onClose={() => setSelectedAuditTransactionId(null)}
              />
            </div>
          )}
        </section>
      </main>
    </DashboardShell>
  );
}
