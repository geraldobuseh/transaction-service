import { AlertTriangle } from 'lucide-react';

export default function ErrorBanner({ message, correlationId }) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-white" />
        <div className="min-w-0">
          <p className="text-sm font-semibold">Request failed</p>
          <p className="mt-1 text-sm leading-6 text-white/85">{message}</p>
          {correlationId && (
            <p className="mt-2 text-xs text-white/85">Correlation ID: {correlationId}</p>
          )}
        </div>
      </div>
    </div>
  );
}
