import { Activity, Database, Moon, ShieldCheck, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useTheme } from '../theme/ThemeContext';
import LogoutButton from './LogoutButton';
import RoleBadge from './RoleBadge';

const navItems = [
  { label: 'Decisioning', icon: ShieldCheck },
  { label: 'Persistence', icon: Database },
  { label: 'Operations', icon: Activity }
];

export default function Navbar() {
  const { username, role, isAuthenticated } = useAuth();
  const { isWhiteBackground, toggleBackgroundMode } = useTheme();

  return (
    <header className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-white/10 shadow-glow">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Transact App</p>
          <p className="text-xs text-white/55">Transaction intelligence console</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <nav className="hidden items-center gap-2 xl:flex">
          {navItems.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/75 backdrop-blur-xl"
            >
              <Icon className="h-3.5 w-3.5 text-white" />
              {label}
            </div>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/80">
                <span className="text-white/45">Signed in as </span>
                <span className="font-semibold text-white">{username}</span>
              </div>
              <RoleBadge role={role} />
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white/82 transition hover:bg-white/[0.085]"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/85"
              >
                Register
              </Link>
            </>
          )}
          <button
              type="button"
              onClick={toggleBackgroundMode}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/[0.085]"
          >
            {isWhiteBackground ? (
                <Moon className="h-4 w-4 text-white" />
            ) : (
                <Sun className="h-4 w-4 text-white" />
            )}
            {isWhiteBackground ? 'Black bg' : 'White bg'}
          </button>
        </div>
      </div>
    </header>
  );
}
