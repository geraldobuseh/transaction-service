import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import ErrorState from '../components/ErrorState';
import { AuthPageShell, AuthSubmitButton } from './LoginPage';

const initialForm = {
  username: '',
  email: '',
  password: '',
  role: 'ANALYST'
};

function validateForm(form) {
  const errors = {};

  if (!form.username.trim()) {
    errors.username = 'Username is required.';
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.password) {
    errors.password = 'Password is required.';
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!form.role) {
    errors.role = 'Role is required.';
  }

  return errors;
}

export default function RegisterPage() {
  const {
    isAuthenticated,
    isAuthenticating,
    authError,
    register,
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
    setTouched({ username: true, email: true, password: true, role: true });

    if (Object.keys(errors).length > 0) {
      return;
    }

    await register(form);
  };

  return (
    <AuthPageShell
      eyebrow="Identity provisioning"
      title="Create a Transact App account"
      description="Register a role-aware user and receive a JWT for secure access to protected transaction workflows."
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
          <span className="field-label">Email</span>
          <input
            className="form-input"
            value={form.email}
            type="email"
            onBlur={() => setTouched((current) => ({ ...current, email: true }))}
            onChange={(event) => updateField('email', event.target.value)}
            autoComplete="email"
          />
          {touched.email && errors.email && <p className="field-error">{errors.email}</p>}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Password</span>
            <input
              className="form-input"
              value={form.password}
              type="password"
              onBlur={() => setTouched((current) => ({ ...current, password: true }))}
              onChange={(event) => updateField('password', event.target.value)}
              autoComplete="new-password"
            />
            {touched.password && errors.password && <p className="field-error">{errors.password}</p>}
          </label>

          <label className="block">
            <span className="field-label">Role</span>
            <select
              className="form-input"
              value={form.role}
              onBlur={() => setTouched((current) => ({ ...current, role: true }))}
              onChange={(event) => updateField('role', event.target.value)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="ANALYST">ANALYST</option>
              <option value="VIEWER">VIEWER</option>
            </select>
            {touched.role && errors.role && <p className="field-error">{errors.role}</p>}
          </label>
        </div>

        {authError && <ErrorState title="Registration failed" message={authError} compact />}

        <AuthSubmitButton
          isLoading={isAuthenticating}
          label="Create account"
          loadingLabel="Creating account"
        />

        <p className="text-center text-sm text-white/58">
          Already have access?{' '}
          <Link to="/login" className="font-semibold text-white transition hover:text-white/70">
            Sign in
          </Link>
        </p>
      </form>
    </AuthPageShell>
  );
}
