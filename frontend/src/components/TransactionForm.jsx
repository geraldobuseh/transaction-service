import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, PlusCircle } from 'lucide-react';
import ErrorState from './ErrorState';

const initialForm = {
  userId: '',
  amount: '',
  type: 'DEBIT',
  description: ''
};

function validateForm(form) {
  const errors = {};

  if (!form.userId.trim()) {
    errors.userId = 'User ID is required.';
  }

  if (!form.amount) {
    errors.amount = 'Amount is required.';
  } else if (!Number.isFinite(Number(form.amount)) || Number(form.amount) <= 0) {
    errors.amount = 'Amount must be greater than zero.';
  }

  if (!form.type) {
    errors.type = 'Transaction type is required.';
  }

  return errors;
}

export default function TransactionForm({
  onCreate,
  isSubmitting,
  submitError,
  onClearError
}) {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const errors = useMemo(() => validateForm(form), [form]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (submitError) {
      onClearError();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ userId: true, amount: true, type: true });

    if (Object.keys(errors).length > 0) {
      return;
    }

    const created = await onCreate(form);

    if (created) {
      setForm(initialForm);
      setTouched({});
    }
  };

  const fieldClass = (field) =>
    `form-input ${touched[field] && errors[field] ? 'border-white/20 bg-white/10' : ''}`;

  return (
    <motion.form
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      onSubmit={handleSubmit}
      className="glass-panel min-w-0 p-5 sm:p-6"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white">
            <PlusCircle className="h-3.5 w-3.5" />
            New evaluation
          </div>
          <h2 className="text-2xl font-semibold text-white">Create transaction</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Submit a transaction for rule-driven classification and persistence.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="field-label">User ID</span>
          <input
            className={fieldClass('userId')}
            value={form.userId}
            onBlur={() => setTouched((current) => ({ ...current, userId: true }))}
            onChange={(event) => updateField('userId', event.target.value)}
            placeholder="merchant1"
          />
          {touched.userId && errors.userId && <p className="field-error">{errors.userId}</p>}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Amount</span>
            <input
              className={fieldClass('amount')}
              value={form.amount}
              type="number"
              min="0.01"
              step="0.01"
              onBlur={() => setTouched((current) => ({ ...current, amount: true }))}
              onChange={(event) => updateField('amount', event.target.value)}
              placeholder="25000"
            />
            {touched.amount && errors.amount && <p className="field-error">{errors.amount}</p>}
          </label>

          <label className="block">
            <span className="field-label">Type</span>
            <select
              className={fieldClass('type')}
              value={form.type}
              onBlur={() => setTouched((current) => ({ ...current, type: true }))}
              onChange={(event) => updateField('type', event.target.value)}
            >
              <option value="DEBIT">DEBIT</option>
              <option value="CREDIT">CREDIT</option>
            </select>
            {touched.type && errors.type && <p className="field-error">{errors.type}</p>}
          </label>
        </div>

        <label className="block">
          <span className="field-label">Description</span>
          <textarea
            className="form-input min-h-28 resize-none"
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="large transfer"
          />
        </label>
      </div>

      {submitError && (
        <div className="mt-5">
          <ErrorState title="Transaction rejected" message={submitError} compact />
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.98 }}
        whileHover={{ y: -1 }}
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-white via-[#ffffff] to-[#ffffff] px-5 py-4 text-sm font-semibold text-[#000000] shadow-glow transition disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Evaluating
          </>
        ) : (
          <>
            Submit transaction
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
