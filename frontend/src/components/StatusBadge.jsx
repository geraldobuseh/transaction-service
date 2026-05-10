import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock3 } from 'lucide-react';

const statusStyles = {
  APPROVED: {
    classes: 'border-green-300/25 bg-green-500/12 text-green-100 shadow-[0_0_20px_rgba(34,197,94,0.12)]',
    icon: CheckCircle2
  },
  FLAGGED: {
    classes: 'border-red-300/30 bg-red-500/12 text-red-100 shadow-[0_0_22px_rgba(239,68,68,0.14)]',
    icon: AlertTriangle
  },
  PENDING: {
    classes: 'border-white/25 bg-white/10 text-white',
    icon: Clock3
  }
};

export default function StatusBadge({ status = 'PENDING' }) {
  const normalizedStatus = String(status || 'PENDING').toUpperCase();
  const style = statusStyles[normalizedStatus] || statusStyles.PENDING;
  const Icon = style.icon;

  return (
    <motion.span
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${style.classes}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {normalizedStatus}
    </motion.span>
  );
}
