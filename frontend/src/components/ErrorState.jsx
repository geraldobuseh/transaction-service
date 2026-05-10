import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Service unavailable',
  message,
  onRetry,
  compact = false
}) {
  return (
    <div
      className={`rounded-2xl border border-white/20 bg-white/10 text-white ${
        compact ? 'p-4' : 'p-6'
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-none text-white" />
        <div className="min-w-0">
          <p className="font-semibold">{title}</p>
          {message && <p className="mt-1 text-sm leading-6 text-white/85">{message}</p>}
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
