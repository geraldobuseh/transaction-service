import { AnimatePresence, motion } from 'framer-motion';
import { FileSearch, GitBranch, RadioTower, RefreshCw, TrendingUp } from 'lucide-react';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import LoadingSkeleton from './LoadingSkeleton';
import StatusBadge from './StatusBadge';
import {
  formatCurrency,
  formatTimestamp,
  formatTransactionId,
  formatType
} from '../utils/formatters';

function MetricCard({ label, value, tone = 'text-white' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <p className="text-xs text-white/55">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function EventCountBadge({ count = 0 }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.065] px-2.5 py-1 text-xs font-medium text-white/78">
      <RadioTower className="h-3 w-3" />
      {count}
    </span>
  );
}

function MobileTransactionCard({ transaction, canViewAudit, onViewAudit, eventCount }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-3xl border border-white/10 bg-white/[0.045] p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-white/45">{formatTransactionId(transaction.id)}</p>
          <p className="mt-1 font-semibold text-white">{transaction.userId}</p>
          {transaction.isOptimistic && (
            <p className="mt-1 text-xs text-white/70">Evaluating now</p>
          )}
        </div>
        <StatusBadge status={transaction.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-white/45">Amount</p>
          <p className="mt-1 font-semibold text-white">{formatCurrency(transaction.amount)}</p>
        </div>
        <div>
          <p className="text-white/45">Type</p>
          <p className="mt-1 font-semibold text-white">{formatType(transaction.type)}</p>
        </div>
        <div>
          <p className="text-white/45">Events</p>
          <p className="mt-1">
            <EventCountBadge count={eventCount} />
          </p>
        </div>
        <div>
          <p className="text-white/45">Pipeline</p>
          <p className="mt-1 inline-flex items-center gap-1 text-white/70">
            <GitBranch className="h-3.5 w-3.5 text-white" />
            Traceable
          </p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/72">
        {transaction.description || 'No description'}
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-white/45">{formatTimestamp(transaction.createdAt)}</p>
        {canViewAudit && !transaction.isOptimistic && (
          <button
            type="button"
            onClick={() => onViewAudit(transaction.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-medium text-white/75 transition hover:bg-white/[0.085]"
          >
            <FileSearch className="h-3.5 w-3.5 text-white" />
            History
          </button>
        )}
      </div>
    </motion.article>
  );
}

export default function TransactionTable({
  transactions,
  metrics,
  isLoading,
  error,
  onRetry,
  canViewAudit = false,
  onViewAudit = () => {},
  eventCountsByTransaction = {}
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="glass-panel min-w-0 p-5 sm:p-6"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-medium text-white/78">
            <TrendingUp className="h-3.5 w-3.5 text-white" />
            Intelligence ledger
          </div>
          <h2 className="text-2xl font-semibold text-white">Transaction intelligence</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Live records returned from the Spring Boot transaction service.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRetry()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-medium text-white/82 transition hover:bg-white/[0.085]"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {isLoading && <LoadingSkeleton />}

      {!isLoading && error && (
        <ErrorState message={error} onRetry={() => onRetry()} />
      )}

      {!isLoading && !error && transactions.length === 0 && <EmptyState />}

      {!isLoading && !error && transactions.length > 0 && (
        <>
          <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total records" value={metrics.total} />
            <MetricCard
              label="Approved"
              value={metrics.approved}
              tone="text-white"
            />
            <MetricCard label="Flagged" value={metrics.flagged} tone="text-white" />
            <MetricCard label="Volume" value={formatCurrency(metrics.volume)} tone="text-white" />
          </div>

          <div className="hidden min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#050505]/45 md:block">
            <div className="max-h-[620px] overflow-auto">
              <table className="w-full min-w-[980px] divide-y divide-white/10">
                <thead className="sticky top-0 z-10 bg-[#050505]/95 backdrop-blur-xl">
                  <tr className="text-left text-xs font-semibold text-white/60">
                    <th className="px-4 py-4">ID</th>
                    <th className="px-4 py-4">User</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Type</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Events</th>
                    <th className="px-4 py-4">Description</th>
                    <th className="px-4 py-4">Timestamp</th>
                    {canViewAudit && <th className="px-4 py-4">History</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <AnimatePresence initial={false}>
                    {transactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ delay: Math.min(index * 0.025, 0.18) }}
                        className="text-sm text-white/75 transition hover:bg-white/[0.055]"
                      >
                        <td className="whitespace-nowrap px-4 py-4 text-white/55">
                          {transaction.isOptimistic ? 'Evaluating' : formatTransactionId(transaction.id)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-white">
                          {transaction.userId}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 font-semibold text-white">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">{formatType(transaction.type)}</td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <StatusBadge status={transaction.status} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <EventCountBadge count={eventCountsByTransaction[transaction.id] || 0} />
                        </td>
                        <td className="max-w-xs px-4 py-4">
                          <span className="line-clamp-2">
                            {transaction.description || 'No description'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-white/55">
                          {formatTimestamp(transaction.createdAt)}
                        </td>
                        {canViewAudit && !transaction.isOptimistic && (
                          <td className="whitespace-nowrap px-4 py-4">
                            <button
                              type="button"
                              onClick={() => onViewAudit(transaction.id)}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-medium text-white/75 transition hover:bg-white/[0.085]"
                            >
                              <FileSearch className="h-3.5 w-3.5 text-white" />
                              History
                            </button>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-3 md:hidden">
            <AnimatePresence initial={false}>
              {transactions.map((transaction) => (
                <MobileTransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  canViewAudit={canViewAudit}
                  onViewAudit={onViewAudit}
                  eventCount={eventCountsByTransaction[transaction.id] || 0}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.section>
  );
}
