import { Activity, Database, RadioTower, ShieldCheck, Wifi } from 'lucide-react';
import { formatAuditTimestamp } from '../utils/formatters';
import TraceId from './TraceId';

function StatusPill({ icon: Icon, label, state, detail }) {
  const tone =
    state === false
      ? 'border-white/20 bg-white/10 text-white'
      : state === null
        ? 'border-white/10 bg-white/[0.04] text-white/55'
        : 'border-white/20 bg-white/10 text-white';

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs ${tone}`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="font-medium">{label}</span>
      {detail && <span className="text-white/38">{detail}</span>}
    </div>
  );
}

export default function PlatformStatusBar({ status }) {
  const lastSeen = status.lastSeenAt ? formatAuditTimestamp(status.lastSeenAt).relative : '';

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-4 sm:px-8">
      <div className="glass-panel flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <StatusPill icon={Wifi} label="API" state={status.apiOnline} detail={status.lastStatus || 'observing'} />
          <StatusPill icon={RadioTower} label="Kafka" state={status.kafkaVisible} detail="event stream" />
          <StatusPill icon={Database} label="SQL Server" state={status.sqlVisible} detail="persistent" />
          <StatusPill icon={ShieldCheck} label="Session" state={status.authenticated} detail="JWT" />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-white/45">
          <Activity className="h-3.5 w-3.5 text-white" />
          <span>{lastSeen || 'Awaiting telemetry'}</span>
          <TraceId value={status.lastCorrelationId} compact />
        </div>
      </div>
    </section>
  );
}
