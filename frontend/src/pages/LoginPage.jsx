import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, LockKeyhole } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import ErrorState from '../components/ErrorState';
import MoneyBackdrop from '../components/MoneyBackdrop';
import Navbar from '../components/Navbar';
import { useTheme } from '../theme/ThemeContext';

const initialForm = {
  username: '',
  password: ''
};

function validateForm(form) {
  const errors = {};

  if (!form.username.trim()) {
    errors.username = 'Username is required.';
  }

  if (!form.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}

export default function LoginPage() {
  const {
    isAuthenticated,
    isAuthenticating,
    authError,
    login,
    clearAuthError
  } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const errors = useMemo(() => validateForm(form), [form]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (authError) {
      clearAuthError();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ username: true, password: true });

    if (Object.keys(errors).length > 0) {
      return;
    }

    await login(form);
  };

  return (
    <AuthPageShell
      eyebrow="Secure access"
      title="Sign in to Transact App"
      description="Access the transaction intelligence console with JWT-backed, role-aware authentication."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="field-label">Username</span>
          <input
            className="form-input"
            value={form.username}
            onBlur={() => setTouched((current) => ({ ...current, username: true }))}
            onChange={(event) => updateField('username', event.target.value)}
            autoComplete="username"
          />
          {touched.username && errors.username && <p className="field-error">{errors.username}</p>}
        </label>

        <label className="block">
          <span className="field-label">Password</span>
          <input
            className="form-input"
            value={form.password}
            type="password"
            onBlur={() => setTouched((current) => ({ ...current, password: true }))}
            onChange={(event) => updateField('password', event.target.value)}
            autoComplete="current-password"
          />
          {touched.password && errors.password && <p className="field-error">{errors.password}</p>}
        </label>

        {authError && <ErrorState title="Login failed" message={authError} compact />}

        <AuthSubmitButton isLoading={isAuthenticating} label="Sign in" loadingLabel="Signing in" />

        <p className="text-center text-sm text-white/58">
          Need access?{' '}
          <Link to="/register" className="font-semibold text-white transition hover:text-white/70">
            Create an account
          </Link>
        </p>
      </form>
    </AuthPageShell>
  );
}

export function AuthPageShell({ eyebrow, title, description, children }) {
  const { backgroundMode } = useTheme();

  return (
    <div
      className={`min-h-screen overflow-hidden text-white transition-colors duration-500 ${
        backgroundMode === 'white' ? 'theme-white bg-[#f7f7f4]' : 'theme-black bg-black'
      }`}
    >
      <MoneyBackdrop />
      <Navbar />

      <main className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="hero-copy max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-white/82 shadow-glow backdrop-blur-xl">
            <LockKeyhole className="h-4 w-4" />
            {eyebrow}
          </div>
          <h1 className="font-display text-5xl font-semibold text-white sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            {description}
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.55, ease: 'easeOut' }}
          className="glass-panel p-5 sm:p-6"
        >
          {children}
        </motion.section>
      </main>
    </div>
  );
}

export function AuthSubmitButton({ isLoading, label, loadingLabel }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      type="submit"
      disabled={isLoading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white px-5 py-4 text-sm font-semibold text-black shadow-glow transition hover:bg-white/86 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </motion.button>
  );
}
