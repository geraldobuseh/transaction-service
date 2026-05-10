import { motion } from 'framer-motion';
import { GitBranch, RadioTower, ShieldAlert, Workflow } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const cards = [
  { key: 'total', label: 'Transactions', icon: Workflow, tone: 'text-white' },
  { key: 'flagged', label: 'Flagged risk', icon: ShieldAlert, tone: 'text-white' },
  { key: 'eventsProcessed', label: 'Events observed', icon: RadioTower, tone: 'text-white' },
  { key: 'rulesTriggered', label: 'Rules triggered', icon: GitBranch, tone: 'text-white' }
];

export default function OperationalMetrics({ transactionMetrics, eventMetrics }) {
  const values = {
    total: transactionMetrics.total,
    flagged: transactionMetrics.flagged,
    eventsProcessed: eventMetrics.eventsProcessed,
    rulesTriggered: eventMetrics.rulesTriggered
  };

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.article
            key={card.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="metric-card rounded-3xl border border-white/10 bg-black/70 p-4 shadow-glass backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-white/55">{card.label}</p>
              <Icon className="h-4 w-4 text-white/80" />
            </div>
            <p className={`mt-3 text-3xl font-semibold ${card.tone}`}>{values[card.key]}</p>
          </motion.article>
        );
      })}
      <div className="sr-only">Current transaction volume is {formatCurrency(transactionMetrics.volume)}</div>
    </section>
  );
}
