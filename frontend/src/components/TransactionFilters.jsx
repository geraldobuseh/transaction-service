import { motion } from 'framer-motion';
import { Filter, RotateCcw } from 'lucide-react';
import { emptyTransactionFilters } from '../utils/transactionFilters';

const statusOptions = ['', 'APPROVED', 'FLAGGED', 'PENDING'];
const typeOptions = ['', 'DEBIT', 'CREDIT'];

export default function TransactionFilters({ filters, onChange, onReset, isLoading }) {
  const updateFilter = (field, value) => {
    onChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-4 sm:p-5"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-white">
          <Filter className="h-4 w-4 text-white" />
          Transaction filters
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-medium text-white/72 transition hover:bg-white/[0.085]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <label className="block">
          <span className="field-label">Status</span>
          <select
            className="form-input"
            value={filters.status}
            onChange={(event) => updateFilter('status', event.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status || 'all'} value={status}>
                {status || 'ALL'}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="field-label">Type</span>
          <select
            className="form-input"
            value={filters.type}
            onChange={(event) => updateFilter('type', event.target.value)}
          >
            {typeOptions.map((type) => (
              <option key={type || 'all'} value={type}>
                {type || 'ALL'}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="field-label">User</span>
          <input
            className="form-input"
            value={filters.userId}
            onChange={(event) => updateFilter('userId', event.target.value)}
            placeholder="merchant"
          />
        </label>

        <label className="block">
          <span className="field-label">Min amount</span>
          <input
            className="form-input"
            type="number"
            min="0"
            value={filters.minAmount}
            onChange={(event) => updateFilter('minAmount', event.target.value)}
            placeholder="0"
          />
        </label>

        <label className="block">
          <span className="field-label">Max amount</span>
          <input
            className="form-input"
            type="number"
            min="0"
            value={filters.maxAmount}
            onChange={(event) => updateFilter('maxAmount', event.target.value)}
            placeholder="50000"
          />
        </label>
      </div>

      {isLoading && <p className="mt-3 text-xs text-white/45">Refreshing filtered ledger...</p>}
    </motion.section>
  );
}
