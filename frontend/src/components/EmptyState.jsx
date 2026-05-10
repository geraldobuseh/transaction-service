import { FileSearch } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.035] p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white">
        <FileSearch className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">No transactions recorded</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/58">
        Submit a transaction to send it through the rule engine and persist the
        result in SQL Server.
      </p>
    </div>
  );
}
