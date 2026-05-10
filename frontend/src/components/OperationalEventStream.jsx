import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, GitBranch, RadioTower, RefreshCw, Send, Workflow } from 'lucide-react';
import { formatAuditTimestamp } from '../utils/formatters';
import ErrorBanner from './ErrorBanner';
import TraceId from './TraceId';

const typeStyles = {
  CREATED: {
    icon: Send,
    label: 'CREATED',
    className: 'border-white/20 bg-white/10 text-white'
  },
  FLAGGED: {
    icon: AlertTriangle,
    label: 'FLAGGED',
    className: 'border-white/20 bg-white/10 text-white'
  },
  RULE_TRIGGERED: {
    icon: GitBranch,
    label: 'RULE',
    className: 'border-white/20 bg-white/10 text-white'
  },
  LIFECYCLE: {
    icon: Workflow,
    label: 'LIFECYCLE',
    className: 'border-white/20 bg-white/20 text-white'
  }
};

function EventCard({ event, index }) {
  const style = typeStyles[event.type] || typeStyles.LIFECYCLE;
  const Icon = style.icon;
  const timestamp = formatAuditTimestamp(event.timestamp);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: Math.min(index * 0.03, 0.16) }}
      className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 transition hover:bg-white/[0.065]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${style.className}`}>
              <Icon className="h-3.5 w-3.5" />
              {style.label}
            </span>
            <span className="font-mono text-xs text-white/45">{event.transactionLabel}</span>
          </div>
          <h3 className="mt-3 text-sm font-semibold text-white">{event.label}</h3>
          <p className="mt-1 text-sm leading-6 text-white/58">{event.description}</p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <p className="text-xs text-white/50">{timestamp.absolute}</p>
          <TraceId value={event.correlationId} compact />
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-xs sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
          <p className="text-white/40">Actor</p>
          <p className="mt-1 truncate font-semibold text-white/80">{event.user}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
          <p className="text-white/40">Role</p>
          <p className="mt-1 font-semibold text-white/80">{event.role}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
          <p className="text-white/40">Rule</p>
          <p className="mt-1 truncate font-semibold text-white/80">{event.ruleTriggered || 'Not applicable'}</p>
        </div>
      </div>
    </motion.article>
  );
}

export default function OperationalEventStream({
  events,
  isLoading,
  error,
  lastRefreshedAt,
  onRefresh
}) {
  const refreshed = lastRefreshedAt ? formatAuditTimestamp(lastRefreshedAt).relative : 'pending';

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel min-w-0 p-5 sm:p-6"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-medium text-white/78">
            <RadioTower className="h-3.5 w-3.5 text-white" />
            Event stream activity
          </div>
          <h2 className="text-2xl font-semibold text-white">Operational event feed</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Polling audit-backed transaction events to visualize asynchronous platform activity.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-medium text-white/82 transition hover:bg-white/[0.085]"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      {!error && events.length === 0 && !isLoading && (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.035] p-6 text-center">
          <RadioTower className="mx-auto h-8 w-8 text-white/70" />
          <p className="mt-3 text-sm font-semibold text-white">No event activity yet</p>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Create or evaluate transactions to populate the operations stream.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </AnimatePresence>
      </div>

      <p className="mt-4 text-xs text-white/42">Last refreshed {refreshed}</p>
    </motion.section>
  );
}
