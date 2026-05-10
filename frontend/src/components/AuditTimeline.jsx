import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileSearch,
  GitBranch,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Workflow,
  X
} from 'lucide-react';
import { useAuditHistory } from '../hooks/useAuditHistory';
import { formatAuditTimestamp, formatTransactionId } from '../utils/formatters';
import ErrorBanner from './ErrorBanner';
import StatusBadge from './StatusBadge';

const eventLabels = {
  TRANSACTION_CREATED: 'Transaction event emitted',
  RULE_EVALUATED: 'Rule execution observed',
  STATUS_CHANGED: 'Lifecycle transition detected',
  TRANSACTION_DELETED: 'Deletion event emitted',
  MANUAL_OVERRIDE: 'Manual override recorded',
  TRANSACTION_VIEWED: 'Trace inspection recorded'
};

const eventIcons = {
  TRANSACTION_CREATED: Activity,
  RULE_EVALUATED: GitBranch,
  STATUS_CHANGED: Workflow,
  TRANSACTION_DELETED: ShieldAlert,
  MANUAL_OVERRIDE: ShieldCheck,
  TRANSACTION_VIEWED: FileSearch
};

function AuditEventCard({ event, index }) {
  const showStatusDelta =
    event.eventType !== 'RULE_EVALUATED' && (event.previousStatus || event.newStatus);
  const timestamp = formatAuditTimestamp(event.createdAt);
  const EventIcon = eventIcons[event.eventType] || Activity;

  return (
    <motion.article
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.035, 0.18), duration: 0.35 }}
      className="relative rounded-3xl border border-white/10 bg-white/[0.045] p-4"
    >
      <div className="absolute -left-[2.08rem] top-4 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-[#050505] shadow-[0_0_20px_rgba(255,255,255,0.18)]">
        <EventIcon className="h-3.5 w-3.5 text-white" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            {eventLabels[event.eventType] || event.eventType}
          </p>
          <p className="mt-2 text-sm leading-6 text-white/75">
            {event.eventDescription}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white/62">
          <Clock3 className="h-3.5 w-3.5 text-white" />
          <span>{timestamp.absolute}</span>
          {timestamp.relative && <span className="text-white/38">({timestamp.relative})</span>}
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
          <p className="text-xs text-white/45">Performed by</p>
          <p className="mt-1 font-semibold text-white">{event.performedBy}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
          <p className="text-xs text-white/45">Role</p>
          <p className="mt-1 font-semibold text-white">{event.performedByRole}</p>
        </div>
        {event.ruleTriggered && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 sm:col-span-2 xl:col-span-1">
            <p className="text-xs text-white/45">Rule triggered</p>
            <p className="mt-1 font-semibold text-white">{event.ruleTriggered}</p>
          </div>
        )}
      </div>

      {showStatusDelta && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {event.previousStatus && <StatusBadge status={event.previousStatus} />}
          <span className="text-xs text-white/35">to</span>
          {event.newStatus && <StatusBadge status={event.newStatus} />}
        </div>
      )}
    </motion.article>
  );
}

export default function AuditTimeline({ transactionId, onClose }) {
  const { history, page, setPage, isLoading, error, refreshHistory } = useAuditHistory(transactionId);
  const events = history?.events ?? [];

  return (
    <motion.aside
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="glass-panel min-w-0 p-5 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-medium text-white/78">
            <Activity className="h-3.5 w-3.5 text-white" />
            Audit timeline
          </div>
          <h2 className="text-2xl font-semibold text-white">
            {transactionId ? formatTransactionId(transactionId) : 'Select a transaction'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Operational trace reconstruction for emitted events, rule decisions, and lifecycle movement.
          </p>
        </div>

        {transactionId && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={refreshHistory}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-white/75 transition hover:bg-white/[0.085]"
              aria-label="Refresh audit history"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-white/75 transition hover:bg-white/[0.085]"
              aria-label="Close audit history"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {!transactionId && (
        <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/[0.035] p-6 text-center">
          <FileSearch className="mx-auto h-8 w-8 text-white/70" />
          <p className="mt-3 text-sm font-semibold text-white">No transaction selected</p>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Use the history action in the transaction ledger to inspect lifecycle events.
          </p>
        </div>
      )}

      {transactionId && isLoading && (
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-3xl border border-white/10 bg-white/[0.045]"
            />
          ))}
        </div>
      )}

      {transactionId && !isLoading && error && (
        <div className="mt-6">
          <ErrorBanner message={error} />
        </div>
      )}

      {transactionId && !isLoading && !error && events.length === 0 && (
        <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/[0.035] p-6 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-white/70" />
          <p className="mt-3 text-sm font-semibold text-white">No audit events yet</p>
          <p className="mt-2 text-sm leading-6 text-white/55">
            New transactions will record creation, rules, and status movement automatically.
          </p>
        </div>
      )}

      {transactionId && !isLoading && !error && events.length > 0 && (
        <>
          <div className="relative mt-6 pl-6">
            <div className="absolute bottom-6 left-0 top-6 w-px bg-gradient-to-b from-white/0 via-white/25 to-white/0" />
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {events.map((event, index) => (
                  <AuditEventCard key={event.id} event={event} index={index} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/55">
              Page {page + 1} of {Math.max(history.totalPages, 1)} · {history.totalElements} events
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={history.first || isLoading}
                onClick={() => setPage((current) => Math.max(current - 1, 0))}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/[0.085] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                disabled={history.last || isLoading}
                onClick={() => setPage((current) => current + 1)}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/[0.085] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.aside>
  );
}
