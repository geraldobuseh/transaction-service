import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export function truncateTraceId(value) {
  if (!value) {
    return 'pending';
  }

  if (value.length <= 14) {
    return value;
  }

  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

export default function TraceId({ value, compact = false }) {
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    if (!value || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={copyValue}
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] font-mono text-white/60 transition hover:bg-white/[0.075] hover:text-white ${
        compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'
      }`}
      title={value || 'Correlation ID pending'}
    >
      {copied ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3 text-white" />}
      {truncateTraceId(value)}
    </button>
  );
}
